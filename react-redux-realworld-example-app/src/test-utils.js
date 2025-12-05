// Test utilities for React Testing Library
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { promiseMiddleware, localStorageMiddleware } from './middleware';

const mockStore = configureStore([promiseMiddleware, localStorageMiddleware]);

/**
 * Custom render function that wraps component with providers
 * @param {React.Component} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.initialState - Initial Redux state
 * @param {Object} options.store - Custom store (optional)
 * @param {string} options.initialRoute - Initial route for MemoryRouter
 * @returns {Object} Render result from @testing-library/react
 */
export function renderWithProviders(ui, {
  initialState = {},
  store = mockStore(initialState),
  initialRoute = '/',
  ...renderOptions
} = {}) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store
  };
}

/**
 * Create a mock store with default state structure
 * @param {Object} overrides - State overrides
 * @returns {Object} Mock store
 */
export function createMockStore(overrides = {}) {
  const defaultState = {
    common: {
      appName: 'Conduit',
      token: null,
      viewChangeCounter: 0
    },
    auth: {
      email: '',
      password: ''
    },
    home: {
      tags: [],
      articles: []
    },
    articleList: {
      articles: [],
      articlesCount: 0,
      currentPage: 0
    },
    article: {
      article: null,
      comments: []
    },
    editor: {
      title: '',
      description: '',
      body: '',
      tagInput: '',
      tagList: []
    },
    profile: {
      profile: {}
    },
    settings: {},
    ...overrides
  };

  return mockStore(defaultState);
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
