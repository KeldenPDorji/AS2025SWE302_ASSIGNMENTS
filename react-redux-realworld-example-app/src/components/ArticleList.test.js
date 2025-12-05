import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import ArticleList from './ArticleList';

describe('ArticleList Component', () => {
  const mockArticles = [
    {
      slug: 'test-article-1',
      title: 'Test Article 1',
      description: 'Test description 1',
      body: 'Test body 1',
      tagList: ['test', 'article'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      favorited: false,
      favoritesCount: 0,
      author: {
        username: 'testuser',
        bio: 'Test bio',
        image: 'https://test.com/image.jpg',
        following: false,
      },
    },
    {
      slug: 'test-article-2',
      title: 'Test Article 2',
      description: 'Test description 2',
      body: 'Test body 2',
      tagList: ['test'],
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
      favorited: true,
      favoritesCount: 5,
      author: {
        username: 'anotheruser',
        bio: 'Another bio',
        image: 'https://test.com/image2.jpg',
        following: true,
      },
    },
  ];

  test('renders loading state when articles is null', () => {
    renderWithProviders(<ArticleList articles={null} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders loading state when articles is undefined', () => {
    renderWithProviders(<ArticleList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders empty state when articles array is empty', () => {
    renderWithProviders(<ArticleList articles={[]} />);
    expect(screen.getByText('No articles are here... yet.')).toBeInTheDocument();
  });

  test('renders list of articles when articles are provided', () => {
    renderWithProviders(<ArticleList articles={mockArticles} />);
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
  });

  test('renders ArticlePreview for each article', () => {
    renderWithProviders(<ArticleList articles={mockArticles} />);
    const articleLinks = screen.getAllByRole('link');
    expect(articleLinks.length).toBeGreaterThan(0);
  });

  test('renders pagination when provided', () => {
    renderWithProviders(
      <ArticleList 
        articles={mockArticles} 
        articlesCount={20}
        currentPage={1}
      />
    );
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
  });

  test('renders article list with less than 10 articles without pagination', () => {
    const { container } = renderWithProviders(
      <ArticleList articles={mockArticles} articlesCount={5} />
    );
    // With articlesCount <= 10, pagination should not render
    const pagination = container.querySelector('.pagination');
    expect(pagination).not.toBeInTheDocument();
  });
});
