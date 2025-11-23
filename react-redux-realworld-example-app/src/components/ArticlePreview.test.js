import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import ArticlePreview from './ArticlePreview';

// We need to test the unwrapped component
const ArticlePreviewComponent = ArticlePreview.WrappedComponent || ArticlePreview;

describe('ArticlePreview Component', () => {
  const mockArticle = {
    slug: 'test-article-slug',
    title: 'Test Article Title',
    description: 'Test article description',
    body: 'Test article body',
    tagList: ['react', 'testing', 'javascript'],
    createdAt: '2025-01-15T10:00:00.000Z',
    favorited: false,
    favoritesCount: 5,
    author: {
      username: 'testuser',
      bio: 'Test bio',
      image: 'https://example.com/avatar.jpg',
      following: false
    }
  };

  const mockDispatch = {
    favorite: jest.fn(),
    unfavorite: jest.fn()
  };

  // Test 1: Rendering article data (title, description, author)
  it('should render article title', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    expect(wrapper.find('h1').text()).toBe('Test Article Title');
  });

  it('should render article description', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    expect(wrapper.find('p').text()).toBe('Test article description');
  });

  it('should render author username', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    const authorLink = wrapper.find(Link).findWhere(n => n.prop('className') === 'author');
    expect(authorLink.children().text()).toBe('testuser');
  });

  it('should render author image', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    const authorImage = wrapper.find('img');
    expect(authorImage.prop('src')).toBe('https://example.com/avatar.jpg');
    expect(authorImage.prop('alt')).toBe('testuser');
  });

  // Test 2: Tag list rendering
  it('should render all tags from tagList', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    const tagList = wrapper.find('.tag-list li');
    expect(tagList).toHaveLength(3);
    expect(tagList.at(0).text()).toBe('react');
    expect(tagList.at(1).text()).toBe('testing');
    expect(tagList.at(2).text()).toBe('javascript');
  });

  it('should render empty tag list when no tags', () => {
    const articleWithoutTags = { ...mockArticle, tagList: [] };
    const wrapper = shallow(
      <ArticlePreviewComponent article={articleWithoutTags} {...mockDispatch} />
    );
    const tagList = wrapper.find('.tag-list li');
    expect(tagList).toHaveLength(0);
  });

  // Test 3: Favorite button functionality
  it('should display correct favorites count', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    const favoriteButton = wrapper.find('button');
    expect(favoriteButton.text()).toContain('5');
  });

  it('should apply NOT_FAVORITED_CLASS when article is not favorited', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    const favoriteButton = wrapper.find('button');
    expect(favoriteButton.hasClass('btn-outline-primary')).toBe(true);
  });

  it('should apply FAVORITED_CLASS when article is favorited', () => {
    const favoritedArticle = { ...mockArticle, favorited: true };
    const wrapper = shallow(
      <ArticlePreviewComponent article={favoritedArticle} {...mockDispatch} />
    );
    const favoriteButton = wrapper.find('button');
    expect(favoriteButton.hasClass('btn-primary')).toBe(true);
  });

  it('should call favorite function when clicking unfavorited article', () => {
    const mockFavorite = jest.fn();
    const mockUnfavorite = jest.fn();
    const wrapper = shallow(
      <ArticlePreviewComponent 
        article={mockArticle} 
        favorite={mockFavorite}
        unfavorite={mockUnfavorite}
      />
    );
    
    const favoriteButton = wrapper.find('button');
    favoriteButton.simulate('click', { preventDefault: () => {} });
    
    expect(mockFavorite).toHaveBeenCalledWith('test-article-slug');
    expect(mockUnfavorite).not.toHaveBeenCalled();
  });

  it('should call unfavorite function when clicking favorited article', () => {
    const mockFavorite = jest.fn();
    const mockUnfavorite = jest.fn();
    const favoritedArticle = { ...mockArticle, favorited: true };
    const wrapper = shallow(
      <ArticlePreviewComponent 
        article={favoritedArticle} 
        favorite={mockFavorite}
        unfavorite={mockUnfavorite}
      />
    );
    
    const favoriteButton = wrapper.find('button');
    favoriteButton.simulate('click', { preventDefault: () => {} });
    
    expect(mockUnfavorite).toHaveBeenCalledWith('test-article-slug');
    expect(mockFavorite).not.toHaveBeenCalled();
  });

  // Test 4: Author link navigation
  it('should link to author profile', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    const authorLinks = wrapper.find(Link).filterWhere(n => n.prop('to') === '/@testuser');
    expect(authorLinks.length).toBeGreaterThan(0);
  });

  it('should link to article detail page', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    const articleLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/article/test-article-slug');
    expect(articleLink).toHaveLength(1);
  });

  // Test 5: Formatted date display
  it('should display formatted creation date', () => {
    const wrapper = shallow(
      <ArticlePreviewComponent article={mockArticle} {...mockDispatch} />
    );
    const dateSpan = wrapper.find('.date');
    const expectedDate = new Date('2025-01-15T10:00:00.000Z').toDateString();
    expect(dateSpan.text()).toBe(expectedDate);
  });

  // Test 6: Default image when author has no image
  it('should use default image when author image is not provided', () => {
    const articleWithoutImage = {
      ...mockArticle,
      author: { ...mockArticle.author, image: null }
    };
    const wrapper = shallow(
      <ArticlePreviewComponent article={articleWithoutImage} {...mockDispatch} />
    );
    const authorImage = wrapper.find('img');
    expect(authorImage.prop('src')).toBe('https://static.productionready.io/images/smiley-cyrus.jpg');
  });
});
