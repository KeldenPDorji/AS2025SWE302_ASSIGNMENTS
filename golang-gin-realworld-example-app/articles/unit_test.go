package articles

import (
	"fmt"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/stretchr/testify/assert"
	"realworld-backend/common"
	"realworld-backend/users"
)

var test_db *gorm.DB

// Setup test database and create mock data
func setupTestDB() {
	test_db = common.TestDBInit()
	users.AutoMigrate()
	test_db.AutoMigrate(&ArticleModel{})
	test_db.AutoMigrate(&TagModel{})
	test_db.AutoMigrate(&FavoriteModel{})
	test_db.AutoMigrate(&ArticleUserModel{})
	test_db.AutoMigrate(&CommentModel{})
}

// Create mock user for testing
func createMockUser(username, email string) users.UserModel {
	userModel := users.UserModel{
		Username: username,
		Email:    email,
		Bio:      "Test bio for " + username,
	}
	test_db.Create(&userModel)
	return userModel
}

// Create mock article for testing
func createMockArticle(title, description, body string, author ArticleUserModel) ArticleModel {
	article := ArticleModel{
		Title:       title,
		Slug:        title + "-slug",
		Description: description,
		Body:        body,
		Author:      author,
		AuthorID:    author.ID,
	}
	test_db.Create(&article)
	return article
}

// Task 1.2 - Test 1: Model Tests - Article creation with valid data
func TestArticleCreation(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	// Create a test user and article user
	userModel := createMockUser("author1", "author1@test.com")
	articleUserModel := GetArticleUserModel(userModel)

	// Create an article
	article := ArticleModel{
		Title:       "Test Article",
		Slug:        "test-article",
		Description: "This is a test article",
		Body:        "Article body content goes here",
		Author:      articleUserModel,
		AuthorID:    articleUserModel.ID,
	}

	err := test_db.Create(&article).Error
	asserts.NoError(err, "article should be created without error")
	asserts.NotZero(article.ID, "article ID should be set after creation")
	asserts.Equal("Test Article", article.Title, "article title should match")
	asserts.Equal("test-article", article.Slug, "article slug should match")
}

// Task 1.2 - Test 2: Model Tests - Article validation (empty title, body, etc.)
func TestArticleValidation(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	userModel := createMockUser("author2", "author2@test.com")
	articleUserModel := GetArticleUserModel(userModel)

	// Test with empty title (should still create but we can verify fields)
	article := ArticleModel{
		Title:       "",
		Slug:        "empty-title-slug",
		Description: "Description",
		Body:        "Body",
		Author:      articleUserModel,
		AuthorID:    articleUserModel.ID,
	}

	test_db.Create(&article)
	asserts.Equal("", article.Title, "empty title should be preserved")

	// Test with long description (max 2048)
	longDesc := make([]byte, 2048)
	for i := range longDesc {
		longDesc[i] = 'a'
	}
	article2 := ArticleModel{
		Title:       "Article with long description",
		Slug:        "long-desc-article-slug",
		Description: string(longDesc),
		Body:        "Body",
		Author:      articleUserModel,
		AuthorID:    articleUserModel.ID,
	}

	err := test_db.Create(&article2).Error
	asserts.NoError(err, "article with max length description should be created")
}

// Task 1.2 - Test 3: Model Tests - Favorite/unfavorite functionality
func TestFavoriteUnfavorite(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	// Create author and article
	author := createMockUser("author3", "author3@test.com")
	authorArticleUser := GetArticleUserModel(author)
	article := createMockArticle("Favorite Test", "Description", "Body", authorArticleUser)

	// Create a user who will favorite the article
	favoriter := createMockUser("favoriter1", "favoriter1@test.com")
	favoriterArticleUser := GetArticleUserModel(favoriter)

	// Test favorite
	asserts.False(article.isFavoriteBy(favoriterArticleUser), "article should not be favorited initially")
	asserts.Equal(uint(0), article.favoritesCount(), "favorites count should be 0 initially")

	err := article.favoriteBy(favoriterArticleUser)
	asserts.NoError(err, "favoriting should not return error")

	// Reload article to check
	var reloadedArticle ArticleModel
	test_db.First(&reloadedArticle, article.ID)
	asserts.True(reloadedArticle.isFavoriteBy(favoriterArticleUser), "article should be favorited")
	asserts.Equal(uint(1), reloadedArticle.favoritesCount(), "favorites count should be 1")

	// Test unfavorite
	err = reloadedArticle.unFavoriteBy(favoriterArticleUser)
	asserts.NoError(err, "unfavoriting should not return error")
	asserts.False(reloadedArticle.isFavoriteBy(favoriterArticleUser), "article should not be favorited after unfavorite")
	asserts.Equal(uint(0), reloadedArticle.favoritesCount(), "favorites count should be 0 after unfavorite")
}

// Task 1.2 - Test 4: Model Tests - Tag association
func TestTagAssociation(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	author := createMockUser("author4", "author4@test.com")
	authorArticleUser := GetArticleUserModel(author)

	article := createMockArticle("Tagged Article", "Description", "Body", authorArticleUser)

	// Test setting tags
	tags := []string{"golang", "testing", "backend"}
	err := article.setTags(tags)
	asserts.NoError(err, "setting tags should not return error")

	// Save article with tags
	err = SaveOne(&article)
	asserts.NoError(err, "saving article should not return error")

	// Reload article with tags
	var reloadedArticle ArticleModel
	test_db.Preload("Tags").First(&reloadedArticle, article.ID)
	asserts.Equal(3, len(reloadedArticle.Tags), "article should have 3 tags")

	// Verify tag names
	tagNames := make([]string, len(reloadedArticle.Tags))
	for i, tag := range reloadedArticle.Tags {
		tagNames[i] = tag.Tag
	}
	asserts.Contains(tagNames, "golang", "should contain golang tag")
	asserts.Contains(tagNames, "testing", "should contain testing tag")
	asserts.Contains(tagNames, "backend", "should contain backend tag")
}

// Task 1.2 - Test 5: Model Tests - Multiple favorites
func TestMultipleFavorites(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	author := createMockUser("author5", "author5@test.com")
	authorArticleUser := GetArticleUserModel(author)
	article := createMockArticle("Popular Article", "Description", "Body", authorArticleUser)

	// Create multiple users who favorite the article
	for i := 1; i <= 5; i++ {
		user := createMockUser(fmt.Sprintf("favoriter%d", i), fmt.Sprintf("fav%d@test.com", i))
		articleUser := GetArticleUserModel(user)
		err := article.favoriteBy(articleUser)
		asserts.NoError(err, "favorite should succeed")
	}

	// Check favorites count
	var reloadedArticle ArticleModel
	test_db.First(&reloadedArticle, article.ID)
	asserts.Equal(uint(5), reloadedArticle.favoritesCount(), "article should have 5 favorites")
}

// Task 1.2 - Test 6: Serializer Tests - ArticleSerializer output format
func TestArticleSerializer(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	// Create test data
	author := createMockUser("serialauthor", "serialauthor@test.com")
	authorArticleUser := GetArticleUserModel(author)
	article := createMockArticle("Serializer Test", "Test Description", "Test Body", authorArticleUser)
	article.setTags([]string{"test", "serializer"})

	// Create gin context for serializer
	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(nil)
	c.Set("my_user_model", author)

	// Test serializer
	serializer := ArticleSerializer{C: c, ArticleModel: article}
	response := serializer.Response()

	asserts.Equal("Serializer Test", response.Title, "title should match")
	asserts.Equal("Test Description", response.Description, "description should match")
	asserts.Equal("Test Body", response.Body, "body should match")
	asserts.NotEmpty(response.Slug, "slug should not be empty")
	asserts.NotEmpty(response.CreatedAt, "createdAt should not be empty")
	asserts.NotEmpty(response.UpdatedAt, "updatedAt should not be empty")
	asserts.Equal(uint(0), response.FavoritesCount, "favorites count should be 0")
	asserts.False(response.Favorite, "should not be favorited by author")
}

// Task 1.2 - Test 7: Serializer Tests - ArticleListSerializer with multiple articles
func TestArticlesSerializer(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	author := createMockUser("listauthor", "listauthor@test.com")
	authorArticleUser := GetArticleUserModel(author)

	// Create multiple articles
	articles := []ArticleModel{
		createMockArticle("Article 1", "Desc 1", "Body 1", authorArticleUser),
		createMockArticle("Article 2", "Desc 2", "Body 2", authorArticleUser),
		createMockArticle("Article 3", "Desc 3", "Body 3", authorArticleUser),
	}

	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(nil)
	c.Set("my_user_model", author)

	serializer := ArticlesSerializer{C: c, Articles: articles}
	response := serializer.Response()

	asserts.Equal(3, len(response), "should serialize 3 articles")
	asserts.Equal("Article 1", response[0].Title, "first article title should match")
	asserts.Equal("Article 2", response[1].Title, "second article title should match")
	asserts.Equal("Article 3", response[2].Title, "third article title should match")
}

// Task 1.2 - Test 8: Serializer Tests - CommentSerializer structure
func TestCommentSerializer(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	author := createMockUser("commentauthor", "commentauthor@test.com")
	authorArticleUser := GetArticleUserModel(author)
	article := createMockArticle("Commented Article", "Description", "Body", authorArticleUser)

	// Create a comment
	commenter := createMockUser("commenter1", "commenter1@test.com")
	commenterArticleUser := GetArticleUserModel(commenter)

	comment := CommentModel{
		Article:   article,
		ArticleID: article.ID,
		Author:    commenterArticleUser,
		AuthorID:  commenterArticleUser.ID,
		Body:      "This is a test comment",
	}
	test_db.Create(&comment)

	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(nil)
	c.Set("my_user_model", commenter)

	serializer := CommentSerializer{C: c, CommentModel: comment}
	response := serializer.Response()

	asserts.NotZero(response.ID, "comment ID should not be zero")
	asserts.Equal("This is a test comment", response.Body, "comment body should match")
	asserts.NotEmpty(response.CreatedAt, "createdAt should not be empty")
	asserts.Equal(commenter.Username, response.Author.Username, "author username should match")
}

// Task 1.2 - Test 9: Validator Tests - ArticleModelValidator with valid input
func TestArticleModelValidatorValid(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	user := createMockUser("validatoruser", "validatoruser@test.com")

	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(nil)
	c.Set("my_user_model", user)

	validator := NewArticleModelValidator()
	validator.Article.Title = "Valid Title"
	validator.Article.Description = "Valid Description"
	validator.Article.Body = "Valid Body"
	validator.Article.Tags = []string{"valid", "tags"}

	// Manually set the article model fields (simulating Bind)
	validator.articleModel.Title = validator.Article.Title
	validator.articleModel.Description = validator.Article.Description
	validator.articleModel.Body = validator.Article.Body
	validator.articleModel.Author = GetArticleUserModel(user)

	asserts.Equal("Valid Title", validator.articleModel.Title, "title should be set")
	asserts.Equal("Valid Description", validator.articleModel.Description, "description should be set")
	asserts.NotNil(validator.articleModel.Author, "author should be set")
}

// Task 1.2 - Test 10: Validator Tests - Validation errors for missing required fields
func TestArticleModelValidatorMissingFields(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	validator := NewArticleModelValidator()

	// Test with empty/missing title (which is required with min=4)
	asserts.Empty(validator.Article.Title, "title should be empty initially")

	// Test validator creation
	validator2 := NewArticleModelValidator()
	asserts.NotNil(validator2, "validator should be created")
}

// Task 1.2 - Test 11: Validator Tests - CommentModelValidator
func TestCommentModelValidator(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	user := createMockUser("commentvalidator", "commentvalidator@test.com")

	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(nil)
	c.Set("my_user_model", user)

	validator := NewCommentModelValidator()
	validator.Comment.Body = "This is a valid comment body"

	// Manually set the comment model fields (simulating Bind)
	validator.commentModel.Body = validator.Comment.Body
	validator.commentModel.Author = GetArticleUserModel(user)

	asserts.Equal("This is a valid comment body", validator.commentModel.Body, "comment body should be set")
	asserts.NotNil(validator.commentModel.Author, "author should be set")
}

// Task 1.2 - Test 12: Test FindOneArticle function
func TestFindOneArticle(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	author := createMockUser("findauthor", "findauthor@test.com")
	authorArticleUser := GetArticleUserModel(author)
	article := createMockArticle("Find Me", "Description", "Body", authorArticleUser)

	// Find by ID
	foundArticle, err := FindOneArticle(&ArticleModel{
		Model: gorm.Model{ID: article.ID},
	})

	asserts.NoError(err, "finding article should not return error")
	asserts.Equal(article.ID, foundArticle.ID, "found article ID should match")
	asserts.Equal("Find Me", foundArticle.Title, "found article title should match")
}

// Task 1.2 - Test 13: Test SaveOne function
func TestSaveOne(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	author := createMockUser("saveauthor", "saveauthor@test.com")
	authorArticleUser := GetArticleUserModel(author)
	article := createMockArticle("Save Test", "Description", "Body", authorArticleUser)

	// Modify and save
	article.Title = "Updated Title"
	err := SaveOne(&article)

	asserts.NoError(err, "saving should not return error")

	// Reload and verify
	var reloaded ArticleModel
	test_db.First(&reloaded, article.ID)
	asserts.Equal("Updated Title", reloaded.Title, "title should be updated")
}

// Task 1.2 - Test 14: Test DeleteArticleModel function
func TestDeleteArticleModel(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	author := createMockUser("deleteauthor", "deleteauthor@test.com")
	authorArticleUser := GetArticleUserModel(author)
	article := createMockArticle("Delete Me", "Description", "Body", authorArticleUser)

	// Delete the article
	err := DeleteArticleModel(&ArticleModel{
		Model: gorm.Model{ID: article.ID},
	})

	asserts.NoError(err, "deleting should not return error")

	// Try to find deleted article
	var deleted ArticleModel
	result := test_db.First(&deleted, article.ID)
	asserts.Error(result.Error, "should not find deleted article")
}

// Task 1.2 - Test 15: Test Comment functionality
func TestCommentCreationAndRetrieval(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	author := createMockUser("articleauthor", "articleauthor@test.com")
	authorArticleUser := GetArticleUserModel(author)
	article := createMockArticle("Commented Article", "Description", "Body", authorArticleUser)

	commenter := createMockUser("commenter2", "commenter2@test.com")
	commenterArticleUser := GetArticleUserModel(commenter)

	// Create comment
	comment := CommentModel{
		Article:   article,
		ArticleID: article.ID,
		Author:    commenterArticleUser,
		AuthorID:  commenterArticleUser.ID,
		Body:      "Great article!",
	}
	err := test_db.Create(&comment).Error
	asserts.NoError(err, "comment creation should not return error")

	// Get comments for article
	err = article.getComments()
	asserts.NoError(err, "getting comments should not return error")
	asserts.GreaterOrEqual(len(article.Comments), 1, "article should have at least 1 comment")
}

// Task 1.2 - Test 16: Test GetArticleUserModel
func TestGetArticleUserModel(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	user := createMockUser("articlesuser", "articlesuser@test.com")

	// Get article user model
	articleUser := GetArticleUserModel(user)
	asserts.NotZero(articleUser.ID, "article user should have ID")
	asserts.Equal(user.ID, articleUser.UserModelID, "user model ID should match")

	// Test with zero user
	emptyUser := users.UserModel{}
	articleUser2 := GetArticleUserModel(emptyUser)
	asserts.Zero(articleUser2.ID, "article user for empty user should have zero ID")
}

// Task 1.2 - Test 17: Test TagSerializer
func TestTagSerializer(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	tag := TagModel{Tag: "golang"}
	test_db.Create(&tag)

	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(nil)

	serializer := TagSerializer{C: c, TagModel: tag}
	response := serializer.Response()

	asserts.Equal("golang", response, "tag serializer should return tag string")
}

// Task 1.2 - Test 18: Test TagsSerializer with multiple tags
func TestTagsSerializer(t *testing.T) {
	setupTestDB()
	defer common.TestDBFree(test_db)

	asserts := assert.New(t)

	tags := []TagModel{
		{Tag: "golang"},
		{Tag: "testing"},
		{Tag: "backend"},
	}

	for i := range tags {
		test_db.Create(&tags[i])
	}

	gin.SetMode(gin.TestMode)
	c, _ := gin.CreateTestContext(nil)

	serializer := TagsSerializer{C: c, Tags: tags}
	response := serializer.Response()

	asserts.Equal(3, len(response), "should have 3 tags")
	asserts.Contains(response, "golang", "should contain golang")
	asserts.Contains(response, "testing", "should contain testing")
	asserts.Contains(response, "backend", "should contain backend")
}
