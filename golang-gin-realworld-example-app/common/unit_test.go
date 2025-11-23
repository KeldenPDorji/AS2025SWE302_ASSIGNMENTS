package common

import (
	"bytes"
	"errors"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/stretchr/testify/assert"
	"github.com/gin-gonic/gin"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"
)

func TestConnectingDatabase(t *testing.T) {
	asserts := assert.New(t)
	db := Init()
	// Test create & close DB
	_, err := os.Stat("./../gorm.db")
	asserts.NoError(err, "Db should exist")
	asserts.NoError(db.DB().Ping(), "Db should be able to ping")

	// Test get a connecting from connection pools
	connection := GetDB()
	asserts.NoError(connection.DB().Ping(), "Db should be able to ping")
	db.Close()

	// Test DB exceptions
	os.Chmod("./../gorm.db", 0000)
	db = Init()
	asserts.Error(db.DB().Ping(), "Db should not be able to ping")
	db.Close()
	os.Chmod("./../gorm.db", 0644)
}

func TestConnectingTestDatabase(t *testing.T) {
	asserts := assert.New(t)
	// Test create & close DB
	db := TestDBInit()
	_, err := os.Stat("./../gorm_test.db")
	asserts.NoError(err, "Db should exist")
	asserts.NoError(db.DB().Ping(), "Db should be able to ping")
	db.Close()

	// Test testDB exceptions
	os.Chmod("./../gorm_test.db", 0000)
	db = TestDBInit()
	_, err = os.Stat("./../gorm_test.db")
	asserts.NoError(err, "Db should exist")
	asserts.Error(db.DB().Ping(), "Db should not be able to ping")
	os.Chmod("./../gorm_test.db", 0644)

	// Test close delete DB
	TestDBFree(db)
	_, err = os.Stat("./../gorm_test.db")

	asserts.Error(err, "Db should not exist")
}

func TestRandString(t *testing.T) {
	asserts := assert.New(t)

	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	str := RandString(0)
	asserts.Equal(str, "", "length should be ''")

	str = RandString(10)
	asserts.Equal(len(str), 10, "length should be 10")
	for _, ch := range str {
		asserts.Contains(letters, ch, "char should be a-z|A-Z|0-9")
	}
}

func TestGenToken(t *testing.T) {
	asserts := assert.New(t)

	token := GenToken(2)

	asserts.IsType(token, string("token"), "token type should be string")
	asserts.Len(token, 115, "JWT's length should be 115")
}

func TestNewValidatorError(t *testing.T) {
	asserts := assert.New(t)

	type Login struct {
		Username string `form:"username" json:"username" binding:"required,alphanum,min=4,max=255"`
		Password string `form:"password" json:"password" binding:"required,min=8,max=255"`
	}

	var requestTests = []struct {
		bodyData       string
		expectedCode   int
		responseRegexg string
		msg            string
	}{
		{
			`{"username": "wangzitian0","password": "0123456789"}`,
			http.StatusOK,
			`{"status":"you are logged in"}`,
			"valid data and should return StatusCreated",
		},
		{
			`{"username": "wangzitian0","password": "01234567866"}`,
			http.StatusUnauthorized,
			`{"errors":{"user":"wrong username or password"}}`,
			"wrong login status should return StatusUnauthorized",
		},
		{
			`{"username": "wangzitian0","password": "0122"}`,
			http.StatusUnprocessableEntity,
			`{"errors":{"Password":"{min: 8}"}}`,
			"invalid password of too short and should return StatusUnprocessableEntity",
		},
		{
			`{"username": "_wangzitian0","password": "0123456789"}`,
			http.StatusUnprocessableEntity,
			`{"errors":{"Username":"{key: alphanum}"}}`,
			"invalid username of non alphanum and should return StatusUnprocessableEntity",
		},
	}

	r := gin.Default()

	r.POST("/login", func(c *gin.Context) {
		var json Login
		if err := Bind(c, &json); err == nil {
			if json.Username == "wangzitian0" && json.Password == "0123456789" {
				c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
			} else {
				c.JSON(http.StatusUnauthorized, NewError("user", errors.New("wrong username or password")))
			}
		} else {
			c.JSON(http.StatusUnprocessableEntity, NewValidatorError(err))
		}
	})

	for _, testData := range requestTests {
		bodyData := testData.bodyData
		req, err := http.NewRequest("POST", "/login", bytes.NewBufferString(bodyData))
		req.Header.Set("Content-Type", "application/json")
		asserts.NoError(err)

		w := httptest.NewRecorder()
		r.ServeHTTP(w, req)

		asserts.Equal(testData.expectedCode, w.Code, "Response Status - "+testData.msg)
		asserts.Regexp(testData.responseRegexg, w.Body.String(), "Response Content - "+testData.msg)
	}
}

func TestNewError(t *testing.T) {
	assert := assert.New(t)

	db := TestDBInit()
	type NotExist struct {
		heheda string
	}
	db.AutoMigrate(NotExist{heheda: "heheda"})

	commenError := NewError("database", db.Find(NotExist{heheda: "heheda"}).Error)
	assert.IsType(commenError, commenError, "commenError should have right type")
	assert.Equal(map[string]interface{}(map[string]interface{}{"database": "no such table: not_exists"}),
		commenError.Errors, "commenError should have right error info")
}

// Additional test cases for Task 1.3

func TestGenTokenWithDifferentUserIDs(t *testing.T) {
	asserts := assert.New(t)

	// Test with user ID 1
	token1 := GenToken(1)
	asserts.IsType(token1, string("token"), "token type should be string")
	asserts.NotEmpty(token1, "token should not be empty")

	// Test with user ID 100
	token100 := GenToken(100)
	asserts.IsType(token100, string("token"), "token type should be string")
	asserts.NotEmpty(token100, "token should not be empty")

	// Tokens with different IDs should be different
	asserts.NotEqual(token1, token100, "tokens for different user IDs should be different")

	// Test with user ID 0
	token0 := GenToken(0)
	asserts.IsType(token0, string("token"), "token type should be string")
	asserts.NotEmpty(token0, "token should not be empty even for user ID 0")
}

func TestJWTTokenValidation(t *testing.T) {
	asserts := assert.New(t)

	// Generate a token
	userID := uint(42)
	token := GenToken(userID)

	// Parse and validate the token
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(NBSecretPassword), nil
	})

	asserts.NoError(err, "token should parse without error")
	asserts.True(parsedToken.Valid, "token should be valid")

	// Extract claims
	if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok {
		// Check user ID in claims
		idFloat, ok := claims["id"].(float64)
		asserts.True(ok, "id claim should exist and be a number")
		asserts.Equal(float64(userID), idFloat, "user ID in token should match")

		// Check expiration exists
		_, hasExp := claims["exp"]
		asserts.True(hasExp, "token should have expiration claim")
	} else {
		t.Error("Failed to extract claims from token")
	}
}

func TestJWTTokenExpiration(t *testing.T) {
	asserts := assert.New(t)

	userID := uint(123)
	token := GenToken(userID)

	// Parse token and check expiration
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(NBSecretPassword), nil
	})

	asserts.NoError(err, "token should parse without error")

	if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok {
		exp, ok := claims["exp"].(float64)
		asserts.True(ok, "expiration should be a number")

		// Check that expiration is approximately 24 hours from now
		expectedExp := time.Now().Add(time.Hour * 24).Unix()
		// Allow 5 second tolerance
		asserts.InDelta(expectedExp, exp, 5, "token should expire in approximately 24 hours")
	}
}

func TestDatabaseConnectionErrorHandling(t *testing.T) {
	asserts := assert.New(t)

	// Test handling when database file has wrong permissions
	db := TestDBInit()
	asserts.NotNil(db, "database should be initialized")

	// Test database ping
	err := db.DB().Ping()
	asserts.NoError(err, "should be able to ping database")

	// Close the database
	db.Close()

	// After closing, ping should fail
	err = db.DB().Ping()
	asserts.Error(err, "ping should fail after closing database")
}

func TestRandStringEdgeCases(t *testing.T) {
	asserts := assert.New(t)

	// Test with various lengths
	lengths := []int{1, 5, 10, 50, 100}
	for _, length := range lengths {
		str := RandString(length)
		asserts.Equal(length, len(str), fmt.Sprintf("string length should be %d", length))

		// Verify all characters are valid
		var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
		for _, ch := range str {
			asserts.Contains(letters, ch, "all characters should be alphanumeric")
		}
	}

	// Test that multiple calls produce different strings
	str1 := RandString(20)
	str2 := RandString(20)
	asserts.NotEqual(str1, str2, "successive calls should produce different random strings")
}

func TestBindFunction(t *testing.T) {
	asserts := assert.New(t)

	type TestStruct struct {
		Name  string `json:"name" binding:"required"`
		Email string `json:"email" binding:"required,email"`
	}

	r := gin.Default()
	r.POST("/test", func(c *gin.Context) {
		var data TestStruct
		if err := Bind(c, &data); err != nil {
			c.JSON(http.StatusUnprocessableEntity, NewValidatorError(err))
			return
		}
		c.JSON(http.StatusOK, gin.H{"name": data.Name, "email": data.Email})
	})

	// Test with valid data
	validJSON := `{"name":"John Doe","email":"john@example.com"}`
	req, _ := http.NewRequest("POST", "/test", bytes.NewBufferString(validJSON))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	asserts.Equal(http.StatusOK, w.Code, "valid data should return 200")
	asserts.Contains(w.Body.String(), "John Doe", "response should contain name")

	// Test with invalid email
	invalidJSON := `{"name":"John Doe","email":"not-an-email"}`
	req, _ = http.NewRequest("POST", "/test", bytes.NewBufferString(invalidJSON))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	asserts.Equal(http.StatusUnprocessableEntity, w.Code, "invalid email should return 422")
}
