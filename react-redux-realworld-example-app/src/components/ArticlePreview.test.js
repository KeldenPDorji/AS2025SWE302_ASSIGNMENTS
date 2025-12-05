import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import ArticlePreview from './ArticlePreview';

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

  // Test 1: Rendering article data (title, description, author)
  test('should render article title', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  test('should render article description', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    expect(screen.getByText('Test article description')).toBeInTheDocument();
  });

  test('should render author username', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    const authorLinks = screen.getAllByText('testuser');
    expect(authorLinks.length).toBeGreaterThan(0);
  });

  test('should render author image', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    const authorImage = screen.getByAltText('testuser');
    expect(authorImage).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  test('should render default image when author image is missing', () => {
    const articleWithoutImage = {
      ...mockArticle,
      author: { ...mockArticle.author, image: null }
    };
    renderWithProviders(<ArticlePreview article={articleWithoutImage} />);
    const authorImage = screen.getByAltText('testuser');
    expect(authorImage).toHaveAttribute('src', 'https://static.productionready.io/images/smiley-cyrus.jpg');
  });

  test('should render formatted creation date', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    // Date format: "Wed Jan 15 2025"
    expect(screen.getByText(/Jan 15 2025/)).toBeInTheDocument();
  });

  // Test 2: Tag list rendering
  test('should render all tags from tagList', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  test('should render empty tag list when no tags', () => {
    const articleWithoutTags = { ...mockArticle, tagList: [] };
    const { container } = renderWithProviders(<ArticlePreview article={articleWithoutTags} />);
    const tagList = container.querySelector('.tag-list');
    expect(tagList.children.length).toBe(0);
  });

  // Test 3: Favorite button functionality
  test('should display correct favorites count', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('should apply NOT_FAVORITED_CLASS when article is not favorited', () => {
    const { container } = renderWithProviders(<ArticlePreview article={mockArticle} />);
    const favoriteButton = container.querySelector('button.btn-outline-primary');
    expect(favoriteButton).toBeInTheDocument();
  });

  test('should apply FAVORITED_CLASS when article is favorited', () => {
    const favoritedArticle = { ...mockArticle, favorited: true };
    const { container } = renderWithProviders(<ArticlePreview article={favoritedArticle} />);
    const favoriteButton = container.querySelector('button.btn-primary');
    expect(favoriteButton).toBeInTheDocument();
  });

  test('should render favorite button for unfavorited article', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<ArticlePreview article={mockArticle} />);
    
    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeInTheDocument();
    // Verify the button has the correct class for unfavorited state
    expect(container.querySelector('.btn-outline-primary')).toBeInTheDocument();
  });

  test('should render favorite button for favorited article', async () => {
    const user = userEvent.setup();
    const favoritedArticle = { ...mockArticle, favorited: true };
    const { container } = renderWithProviders(<ArticlePreview article={favoritedArticle} />);
    
    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeInTheDocument();
    // Verify the button has the correct class for favorited state
    expect(container.querySelector('.btn-primary')).toBeInTheDocument();
  });

  // Test 4: Author link navigation
  test('should link to author profile', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    const authorLinks = screen.getAllByRole('link', { name: /testuser/i });
    expect(authorLinks[0]).toHaveAttribute('href', '/@testuser');
  });

  test('should link to article detail page', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    const articleLink = screen.getByRole('link', { name: /Test Article Title/i });
    expect(articleLink).toHaveAttribute('href', '/article/test-article-slug');
  });

  // Test 5: Read more link
  test('should display "Read more..." link', () => {
    renderWithProviders(<ArticlePreview article={mockArticle} />);
    expect(screen.getByText('Read more...')).toBeInTheDocument();
  });

  // Test 6: Component structure
  test('should have correct CSS classes', () => {
    const { container } = renderWithProviders(<ArticlePreview article={mockArticle} />);
    expect(container.querySelector('.article-preview')).toBeInTheDocument();
    expect(container.querySelector('.article-meta')).toBeInTheDocument();
    expect(container.querySelector('.preview-link')).toBeInTheDocument();
  });

  // Test 7: Multiple tags rendering
  test('should render tags in correct order', () => {
    const { container } = renderWithProviders(<ArticlePreview article={mockArticle} />);
    const tags = container.querySelectorAll('.tag-list li');
    expect(tags[0]).toHaveTextContent('react');
    expect(tags[1]).toHaveTextContent('testing');
    expect(tags[2]).toHaveTextContent('javascript');
  });

  // Test 8: Favorites count updates
  test('should display updated favorites count', () => {
    const articleWithManyFavorites = { ...mockArticle, favoritesCount: 42 };
    renderWithProviders(<ArticlePreview article={articleWithManyFavorites} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('should handle zero favorites', () => {
    const articleWithNoFavorites = { ...mockArticle, favoritesCount: 0 };
    renderWithProviders(<ArticlePreview article={articleWithNoFavorites} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
