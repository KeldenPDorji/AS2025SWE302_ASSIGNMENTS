import editorReducer from '../reducers/editor';
import {
  EDITOR_PAGE_LOADED,
  EDITOR_PAGE_UNLOADED,
  ARTICLE_SUBMITTED,
  ASYNC_START,
  ADD_TAG,
  REMOVE_TAG,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

describe('editor reducer', () => {
  test('should return the initial state', () => {
    expect(editorReducer(undefined, {})).toEqual({});
  });

  describe('EDITOR_PAGE_LOADED action', () => {
    test('should load existing article for editing', () => {
      const action = {
        type: EDITOR_PAGE_LOADED,
        payload: {
          article: {
            slug: 'test-article',
            title: 'Test Article',
            description: 'Test Description',
            body: 'Test Body',
            tagList: ['react', 'testing']
          }
        }
      };
      const newState = editorReducer({}, action);
      expect(newState.articleSlug).toBe('test-article');
      expect(newState.title).toBe('Test Article');
      expect(newState.description).toBe('Test Description');
      expect(newState.body).toBe('Test Body');
      expect(newState.tagList).toEqual(['react', 'testing']);
      expect(newState.tagInput).toBe('');
    });

    test('should initialize empty form for new article', () => {
      const action = {
        type: EDITOR_PAGE_LOADED,
        payload: null
      };
      const newState = editorReducer({}, action);
      expect(newState.articleSlug).toBe('');
      expect(newState.title).toBe('');
      expect(newState.description).toBe('');
      expect(newState.body).toBe('');
      expect(newState.tagList).toEqual([]);
      expect(newState.tagInput).toBe('');
    });

    test('should clear tagInput even when loading existing article', () => {
      const initialState = {
        tagInput: 'old-tag'
      };
      const action = {
        type: EDITOR_PAGE_LOADED,
        payload: {
          article: {
            slug: 'test',
            title: 'Test',
            description: 'Desc',
            body: 'Body',
            tagList: ['tag1']
          }
        }
      };
      const newState = editorReducer(initialState, action);
      expect(newState.tagInput).toBe('');
    });
  });

  describe('EDITOR_PAGE_UNLOADED action', () => {
    test('should reset state', () => {
      const initialState = {
        articleSlug: 'test-slug',
        title: 'Test Title',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['react'],
        tagInput: 'javascript'
      };
      const action = { type: EDITOR_PAGE_UNLOADED };
      const newState = editorReducer(initialState, action);
      expect(newState).toEqual({});
    });
  });

  describe('ARTICLE_SUBMITTED action', () => {
    test('should handle successful submission', () => {
      const initialState = {
        title: 'Test',
        inProgress: true
      };
      const action = {
        type: ARTICLE_SUBMITTED,
        error: false,
        payload: {
          article: {
            slug: 'test-article'
          }
        }
      };
      const newState = editorReducer(initialState, action);
      expect(newState.inProgress).toBe(null);
      expect(newState.errors).toBe(null);
    });

    test('should handle submission errors', () => {
      const initialState = {
        title: 'Test',
        inProgress: true
      };
      const action = {
        type: ARTICLE_SUBMITTED,
        error: true,
        payload: {
          errors: {
            title: ['cannot be blank'],
            body: ['cannot be blank']
          }
        }
      };
      const newState = editorReducer(initialState, action);
      expect(newState.inProgress).toBe(null);
      expect(newState.errors).toEqual({
        title: ['cannot be blank'],
        body: ['cannot be blank']
      });
    });
  });

  describe('ASYNC_START action', () => {
    test('should set inProgress for ARTICLE_SUBMITTED subtype', () => {
      const action = {
        type: ASYNC_START,
        subtype: ARTICLE_SUBMITTED
      };
      const initialState = {
        title: 'Test Title'
      };
      const newState = editorReducer(initialState, action);
      expect(newState.inProgress).toBe(true);
      expect(newState.title).toBe('Test Title');
    });

    test('should not modify state for other subtypes', () => {
      const action = {
        type: ASYNC_START,
        subtype: 'OTHER_ACTION'
      };
      const initialState = {
        title: 'Test Title'
      };
      const newState = editorReducer(initialState, action);
      expect(newState).toEqual(initialState);
    });
  });

  describe('ADD_TAG action', () => {
    test('should add tag from tagInput to tagList', () => {
      const initialState = {
        tagInput: 'react',
        tagList: ['javascript']
      };
      const action = { type: ADD_TAG };
      const newState = editorReducer(initialState, action);
      expect(newState.tagList).toEqual(['javascript', 'react']);
      expect(newState.tagInput).toBe('');
    });

    test('should clear tagInput after adding tag', () => {
      const initialState = {
        tagInput: 'testing',
        tagList: []
      };
      const action = { type: ADD_TAG };
      const newState = editorReducer(initialState, action);
      expect(newState.tagInput).toBe('');
    });

    test('should add tag to empty tagList', () => {
      const initialState = {
        tagInput: 'first-tag',
        tagList: []
      };
      const action = { type: ADD_TAG };
      const newState = editorReducer(initialState, action);
      expect(newState.tagList).toEqual(['first-tag']);
    });
  });

  describe('REMOVE_TAG action', () => {
    test('should remove specified tag from tagList', () => {
      const initialState = {
        tagList: ['react', 'javascript', 'testing']
      };
      const action = {
        type: REMOVE_TAG,
        tag: 'javascript'
      };
      const newState = editorReducer(initialState, action);
      expect(newState.tagList).toEqual(['react', 'testing']);
    });

    test('should not affect other tags', () => {
      const initialState = {
        tagList: ['react', 'javascript']
      };
      const action = {
        type: REMOVE_TAG,
        tag: 'react'
      };
      const newState = editorReducer(initialState, action);
      expect(newState.tagList).toEqual(['javascript']);
    });

    test('should handle removing non-existent tag', () => {
      const initialState = {
        tagList: ['react', 'javascript']
      };
      const action = {
        type: REMOVE_TAG,
        tag: 'nonexistent'
      };
      const newState = editorReducer(initialState, action);
      expect(newState.tagList).toEqual(['react', 'javascript']);
    });

    test('should handle empty tagList', () => {
      const initialState = {
        tagList: []
      };
      const action = {
        type: REMOVE_TAG,
        tag: 'sometag'
      };
      const newState = editorReducer(initialState, action);
      expect(newState.tagList).toEqual([]);
    });
  });

  describe('UPDATE_FIELD_EDITOR action', () => {
    test('should update title field', () => {
      const action = {
        type: UPDATE_FIELD_EDITOR,
        key: 'title',
        value: 'New Title'
      };
      const newState = editorReducer({}, action);
      expect(newState.title).toBe('New Title');
    });

    test('should update description field', () => {
      const action = {
        type: UPDATE_FIELD_EDITOR,
        key: 'description',
        value: 'New Description'
      };
      const newState = editorReducer({}, action);
      expect(newState.description).toBe('New Description');
    });

    test('should update body field', () => {
      const action = {
        type: UPDATE_FIELD_EDITOR,
        key: 'body',
        value: 'New Body Content'
      };
      const newState = editorReducer({}, action);
      expect(newState.body).toBe('New Body Content');
    });

    test('should update tagInput field', () => {
      const action = {
        type: UPDATE_FIELD_EDITOR,
        key: 'tagInput',
        value: 'new-tag'
      };
      const newState = editorReducer({}, action);
      expect(newState.tagInput).toBe('new-tag');
    });

    test('should preserve existing fields when updating', () => {
      const initialState = {
        title: 'Existing Title',
        description: 'Existing Description',
        body: 'Existing Body'
      };
      const action = {
        type: UPDATE_FIELD_EDITOR,
        key: 'description',
        value: 'Updated Description'
      };
      const newState = editorReducer(initialState, action);
      expect(newState.title).toBe('Existing Title');
      expect(newState.description).toBe('Updated Description');
      expect(newState.body).toBe('Existing Body');
    });
  });
});
