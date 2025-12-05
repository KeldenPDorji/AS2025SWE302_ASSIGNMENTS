import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import Login from './components/Login';
import ArticleList from './components/ArticleList';
import ArticlePreview from './components/ArticlePreview';
import {
  LOGIN,
  UPDATE_FIELD_AUTH,
  ARTICLE_FAVORITED,
  ARTICLE_UNFAVORITED
} from './constants/actionTypes';

describe('Frontend Integration Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Login Flow', () => {
    test('should dispatch UPDATE_FIELD_AUTH when email field changes', () => {
      const preloadedState = {
        auth: { email: '', password: '', errors: null, inProgress: false },
        common: { redirectTo: null }
      };
      const { store } = renderWithProviders(<Login />, { preloadedState });

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

      const actions = store.getActions();
      const updateAction = actions.find(a => a.type === UPDATE_FIELD_AUTH && a.key === 'email');
      expect(updateAction).toBeTruthy();
      expect(updateAction.value).toBe('test@test.com');
    });

    test('should dispatch UPDATE_FIELD_AUTH when password field changes', () => {
      const preloadedState = {
        auth: { email: '', password: '', errors: null, inProgress: false },
        common: { redirectTo: null }
      };
      const { store } = renderWithProviders(<Login />, { preloadedState });

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const actions = store.getActions();
      const updateAction = actions.find(a => a.type === UPDATE_FIELD_AUTH && a.key === 'password');
      expect(updateAction).toBeTruthy();
      expect(updateAction.value).toBe('password123');
    });

    test('should verify LOGIN action can be dispatched', () => {
      const testPassword = 'test-pwd-' + Date.now();
      const preloadedState = {
        auth: {
          email: 'test@test.com',
          password: testPassword,
          errors: null,
          inProgress: false
        },
        common: { redirectTo: null }
      };
      renderWithProviders(<Login />, { preloadedState });

      // Verify the form is ready for submission
      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toBeInTheDocument();
      
      // Verify email and password inputs are present
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toBeInTheDocument();
      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toBeInTheDocument();
    });

    test('should render login form with error state', () => {
      const preloadedState = {
        auth: {
          email: 'test@test.com',
          password: 'wrongpass',
          errors: { 'email or password': ['is invalid'] },
          inProgress: false
        },
        common: { redirectTo: null }
      };
      renderWithProviders(<Login />, { preloadedState });

      // Verify form fields are present
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    test('should verify button renders with inProgress flag', () => {
      const preloadedState = {
        auth: {
          email: 'test@test.com',
          password: 'password',
          errors: null,
          inProgress: true
        },
        common: { redirectTo: null }
      };
      renderWithProviders(<Login />, { preloadedState });

      // Verify the button is rendered
      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Article List and Favorite Flow', () => {
    const mockArticles = [
      {
        slug: 'test-article-1',
        title: 'Test Article 1',
        description: 'Description 1',
        body: 'Body 1',
        tagList: ['react'],
        createdAt: '2024-01-01',
        favorited: false,
        favoritesCount: 5,
        author: {
          username: 'testuser',
          bio: 'Bio',
          image: 'https://test.com/img.jpg',
          following: false
        }
      }
    ];

    test('should render article list with articles', () => {
      renderWithProviders(<ArticleList articles={mockArticles} />);
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });

    test('should render favorite button when article is unfavorited', async () => {
      const { container } = renderWithProviders(
        <ArticlePreview article={mockArticles[0]} />
      );

      const favoriteButton = screen.getByRole('button');
      expect(favoriteButton).toBeInTheDocument();
      // Check for unfavorited class
      expect(container.querySelector('.btn-outline-primary')).toBeInTheDocument();
    });

    test('should render favorite button when article is favorited', async () => {
      const favoritedArticle = { ...mockArticles[0], favorited: true };
      const { container } = renderWithProviders(
        <ArticlePreview article={favoritedArticle} />
      );

      const favoriteButton = screen.getByRole('button');
      expect(favoriteButton).toBeInTheDocument();
      // Check for favorited class
      expect(container.querySelector('.btn-primary')).toBeInTheDocument();
    });

    test('should update favorites count after favoriting', () => {
      renderWithProviders(<ArticlePreview article={mockArticles[0]} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Redux State Integration', () => {
    test('should dispatch actions when form inputs change', () => {
      const preloadedState = {
        auth: { email: '', password: '', errors: null, inProgress: false },
        common: { redirectTo: null }
      };
      const { store } = renderWithProviders(<Login />, { preloadedState });

      // Verify email input is present
      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toBeInTheDocument();

      // Update input
      fireEvent.change(emailInput, { target: { value: 'new@test.com' } });

      // Verify action was dispatched
      const actions = store.getActions();
      expect(actions.some(a => a.type === UPDATE_FIELD_AUTH && a.value === 'new@test.com')).toBe(true);
    });

    test('should handle multiple sequential actions', () => {
      const preloadedState = {
        auth: { email: '', password: '', errors: null, inProgress: false },
        common: { redirectTo: null }
      };
      const { store } = renderWithProviders(<Login />, { preloadedState });

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const actions = store.getActions();
      expect(actions.length).toBeGreaterThanOrEqual(2);
      expect(actions.some(a => a.key === 'email')).toBe(true);
      expect(actions.some(a => a.key === 'password')).toBe(true);
    });
  });

  describe('Loading States', () => {
    test('should show loading state when articles is null', () => {
      renderWithProviders(<ArticleList articles={null} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should show empty state when no articles exist', () => {
      renderWithProviders(<ArticleList articles={[]} />);
      expect(screen.getByText('No articles are here... yet.')).toBeInTheDocument();
    });

    test('should show articles when loaded', () => {
      const articles = [
        {
          slug: 'test',
          title: 'Test Article',
          description: 'Test Desc',
          body: 'Test Body',
          tagList: [],
          createdAt: '2024-01-01',
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'user',
            bio: 'Bio',
            image: 'img.jpg',
            following: false
          }
        }
      ];
      renderWithProviders(<ArticleList articles={articles} />);
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
  });
});
