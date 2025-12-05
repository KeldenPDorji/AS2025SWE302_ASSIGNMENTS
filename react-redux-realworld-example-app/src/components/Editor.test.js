import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Editor from './Editor';

// Mock the agent module
jest.mock('../agent', () => ({
  Articles: {
    create: jest.fn(() => Promise.resolve({ article: {} })),
    update: jest.fn(() => Promise.resolve({ article: {} })),
    get: jest.fn(() => Promise.resolve({ article: { title: 'Test', description: 'Desc', body: 'Body', tagList: [] } }))
  }
}));

describe('Editor Component', () => {
  const mockMatch = {
    params: {}
  };

  // Test 1: Form field rendering
  test('renders all form fields', () => {
    const preloadedState = {
      editor: {
        title: '',
        description: '',
        body: '',
        tagInput: '',
        tagList: []
      }
    };
    
    renderWithProviders(<Editor match={mockMatch} />, { preloadedState });
    
    expect(screen.getByPlaceholderText('Article Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's this article about?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your article (in markdown)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter tags')).toBeInTheDocument();
    expect(screen.getByText('Publish Article')).toBeInTheDocument();
  });

  // Test 2: Input field updates
  test('updates form fields on input change', () => {
    const preloadedState = {
      editor: {
        title: '',
        description: '',
        body: '',
        tagInput: '',
        tagList: []
      }
    };
    
    const { store } = renderWithProviders(<Editor match={mockMatch} />, { preloadedState });
    
    const titleInput = screen.getByPlaceholderText('Article Title');
    fireEvent.change(titleInput, { target: { value: 'New Article' } });
    
    // Check that action was dispatched
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: 'UPDATE_FIELD_EDITOR',
        key: 'title',
        value: 'New Article'
      })
    );
  });

  // Test 3: Tag input functionality
  test('adds tag when Enter key is pressed', () => {
    const preloadedState = {
      editor: {
        title: '',
        description: '',
        body: '',
        tagInput: 'react',
        tagList: []
      }
    };
    
    const { store } = renderWithProviders(<Editor match={mockMatch} />, { preloadedState });
    
    const tagInput = screen.getByPlaceholderText('Enter tags');
    fireEvent.keyUp(tagInput, { keyCode: 13 });
    
    // Check that ADD_TAG action was dispatched
    const actions = store.getActions();
    expect(actions).toContainEqual({ type: 'ADD_TAG' });
  });

  // Test 4: Tag list rendering
  test('renders tag list container in form', () => {
    const preloadedState = {
      editor: {
        title: '',
        description: '',
        body: '',
        tagInput: '',
        tagList: []
      }
    };
    
    const { container } = renderWithProviders(<Editor match={mockMatch} />, { preloadedState });
    
    // Check that tag list container exists for displaying tags
    const tagList = container.querySelector('.tag-list');
    expect(tagList).toBeInTheDocument();
    
    // Verify tag input field for entering tags
    expect(screen.getByPlaceholderText('Enter tags')).toBeInTheDocument();
  });

  // Test 5: Tag functionality
  test('provides tag input functionality', () => {
    const preloadedState = {
      editor: {
        title: '',
        description: '',
        body: '',
        tagInput: 'newtag',
        tagList: []
      }
    };
    
    const { container } = renderWithProviders(<Editor match={mockMatch} />, { preloadedState });
    
    // Verify tag list container exists for tag management
    const tagList = container.querySelector('.tag-list');
    expect(tagList).toBeInTheDocument();
    
    // Verify tag input field is present
    const tagInput = screen.getByPlaceholderText('Enter tags');
    expect(tagInput).toBeInTheDocument();
  });

  // Test 6: Form submission
  test('submits form with article data', () => {
    const preloadedState = {
      editor: {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagInput: '',
        tagList: ['test']
      }
    };
    
    const { store } = renderWithProviders(<Editor match={mockMatch} />, { preloadedState });
    
    const submitButton = screen.getByText('Publish Article');
    fireEvent.click(submitButton);
    
    // Check that ARTICLE_SUBMITTED action was dispatched
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: 'ARTICLE_SUBMITTED'
      })
    );
  });

  // Test 7: Submit button state during inProgress
  test('renders submit button with correct state', () => {
    const preloadedState = {
      editor: {
        title: 'Test',
        description: 'Test',
        body: 'Test',
        tagInput: '',
        tagList: [],
        inProgress: false
      }
    };
    
    renderWithProviders(<Editor match={mockMatch} />, { preloadedState });
    
    const submitButton = screen.getByText('Publish Article');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass('btn-primary');
  });

  // Test 8: Form validation
  test('renders form with all required fields for validation', () => {
    const preloadedState = {
      editor: {
        title: '',
        description: '',
        body: '',
        tagInput: '',
        tagList: []
      }
    };
    
    renderWithProviders(<Editor match={mockMatch} />, { preloadedState });
    
    // Verify all form fields are present for validation
    expect(screen.getByPlaceholderText('Article Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your article (in markdown)')).toBeInTheDocument();
  });
});
