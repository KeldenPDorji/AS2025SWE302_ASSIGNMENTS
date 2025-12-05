import articleListReducer from './articleList';
import {
  ARTICLE_FAVORITED,
  ARTICLE_UNFAVORITED,
  SET_PAGE,
  APPLY_TAG_FILTER,
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  CHANGE_TAB,
  PROFILE_PAGE_LOADED,
  PROFILE_FAVORITES_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED
} from '../constants/actionTypes';

describe('articleList reducer', () => {
  // Test 1: Initial state
  test('should return initial state', () => {
    expect(articleListReducer(undefined, {})).toEqual({});
  });

  // Test 2: HOME_PAGE_LOADED updates articles
  test('should handle HOME_PAGE_LOADED', () => {
    const action = {
      type: HOME_PAGE_LOADED,
      payload: [
        { tags: ['react', 'redux'] },
        {
          articles: [
            { slug: 'test-1', title: 'Test 1' },
            { slug: 'test-2', title: 'Test 2' }
          ],
          articlesCount: 2
        }
      ],
      tab: 'all',
      pager: jest.fn()
    };

    const newState = articleListReducer({}, action);
    
    expect(newState.articles).toHaveLength(2);
    expect(newState.articlesCount).toBe(2);
    expect(newState.tags).toEqual(['react', 'redux']);
    expect(newState.tab).toBe('all');
    expect(newState.currentPage).toBe(0);
  });

  // Test 3: HOME_PAGE_UNLOADED clears state
  test('should handle HOME_PAGE_UNLOADED', () => {
    const initialState = {
      articles: [{ slug: 'test', title: 'Test' }],
      articlesCount: 1,
      tags: ['test']
    };

    const action = { type: HOME_PAGE_UNLOADED };
    const newState = articleListReducer(initialState, action);
    
    expect(newState).toEqual({});
  });

  // Test 4: SET_PAGE updates pagination
  test('should handle SET_PAGE', () => {
    const initialState = {
      articles: [{ slug: 'old', title: 'Old' }],
      articlesCount: 1,
      currentPage: 0
    };

    const action = {
      type: SET_PAGE,
      page: 2,
      payload: {
        articles: [
          { slug: 'new-1', title: 'New 1' },
          { slug: 'new-2', title: 'New 2' }
        ],
        articlesCount: 20
      }
    };

    const newState = articleListReducer(initialState, action);
    
    expect(newState.articles).toHaveLength(2);
    expect(newState.articlesCount).toBe(20);
    expect(newState.currentPage).toBe(2);
  });

  // Test 5: APPLY_TAG_FILTER updates articles and tag
  test('should handle APPLY_TAG_FILTER', () => {
    const action = {
      type: APPLY_TAG_FILTER,
      tag: 'react',
      pager: jest.fn(),
      payload: {
        articles: [{ slug: 'react-article', title: 'React Article' }],
        articlesCount: 1
      }
    };

    const newState = articleListReducer({}, action);
    
    expect(newState.articles).toHaveLength(1);
    expect(newState.tag).toBe('react');
    expect(newState.tab).toBeNull();
    expect(newState.currentPage).toBe(0);
  });

  // Test 6: CHANGE_TAB updates tab and articles
  test('should handle CHANGE_TAB', () => {
    const action = {
      type: CHANGE_TAB,
      tab: 'feed',
      pager: jest.fn(),
      payload: {
        articles: [{ slug: 'feed-article', title: 'Feed Article' }],
        articlesCount: 5
      }
    };

    const newState = articleListReducer({}, action);
    
    expect(newState.articles).toHaveLength(1);
    expect(newState.tab).toBe('feed');
    expect(newState.tag).toBeNull();
    expect(newState.currentPage).toBe(0);
  });

  // Test 7: ARTICLE_FAVORITED updates article in list
  test('should handle ARTICLE_FAVORITED', () => {
    const initialState = {
      articles: [
        { slug: 'test-1', favorited: false, favoritesCount: 5 },
        { slug: 'test-2', favorited: false, favoritesCount: 3 }
      ]
    };

    const action = {
      type: ARTICLE_FAVORITED,
      payload: {
        article: {
          slug: 'test-1',
          favorited: true,
          favoritesCount: 6
        }
      }
    };

    const newState = articleListReducer(initialState, action);
    
    expect(newState.articles[0].favorited).toBe(true);
    expect(newState.articles[0].favoritesCount).toBe(6);
    expect(newState.articles[1].favorited).toBe(false);
  });

  // Test 8: ARTICLE_UNFAVORITED updates article in list
  test('should handle ARTICLE_UNFAVORITED', () => {
    const initialState = {
      articles: [
        { slug: 'test-1', favorited: true, favoritesCount: 6 },
        { slug: 'test-2', favorited: false, favoritesCount: 3 }
      ]
    };

    const action = {
      type: ARTICLE_UNFAVORITED,
      payload: {
        article: {
          slug: 'test-1',
          favorited: false,
          favoritesCount: 5
        }
      }
    };

    const newState = articleListReducer(initialState, action);
    
    expect(newState.articles[0].favorited).toBe(false);
    expect(newState.articles[0].favoritesCount).toBe(5);
  });

  // Test 9: PROFILE_PAGE_LOADED updates articles
  test('should handle PROFILE_PAGE_LOADED', () => {
    const action = {
      type: PROFILE_PAGE_LOADED,
      pager: jest.fn(),
      payload: [
        { profile: { username: 'testuser' } },
        {
          articles: [{ slug: 'profile-article', title: 'Profile Article' }],
          articlesCount: 1
        }
      ]
    };

    const newState = articleListReducer({}, action);
    
    expect(newState.articles).toHaveLength(1);
    expect(newState.articlesCount).toBe(1);
    expect(newState.currentPage).toBe(0);
  });

  // Test 10: PROFILE_FAVORITES_PAGE_LOADED updates articles
  test('should handle PROFILE_FAVORITES_PAGE_LOADED', () => {
    const action = {
      type: PROFILE_FAVORITES_PAGE_LOADED,
      pager: jest.fn(),
      payload: [
        { profile: { username: 'testuser' } },
        {
          articles: [{ slug: 'fav-article', title: 'Favorite Article' }],
          articlesCount: 1
        }
      ]
    };

    const newState = articleListReducer({}, action);
    
    expect(newState.articles).toHaveLength(1);
    expect(newState.articlesCount).toBe(1);
  });

  // Test 11: PROFILE_PAGE_UNLOADED clears state
  test('should handle PROFILE_PAGE_UNLOADED', () => {
    const initialState = {
      articles: [{ slug: 'test', title: 'Test' }],
      articlesCount: 1
    };

    const action = { type: PROFILE_PAGE_UNLOADED };
    const newState = articleListReducer(initialState, action);
    
    expect(newState).toEqual({});
  });

  // Test 12: PROFILE_FAVORITES_PAGE_UNLOADED clears state
  test('should handle PROFILE_FAVORITES_PAGE_UNLOADED', () => {
    const initialState = {
      articles: [{ slug: 'test', title: 'Test' }],
      articlesCount: 1
    };

    const action = { type: PROFILE_FAVORITES_PAGE_UNLOADED };
    const newState = articleListReducer(initialState, action);
    
    expect(newState).toEqual({});
  });
});
