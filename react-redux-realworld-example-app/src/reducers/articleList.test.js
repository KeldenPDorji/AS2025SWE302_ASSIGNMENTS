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
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_LOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED
} from '../constants/actionTypes';

describe('articleList reducer', () => {
  const mockArticles = [
    {
      slug: 'test-article-1',
      title: 'Test Article 1',
      favorited: false,
      favoritesCount: 5
    },
    {
      slug: 'test-article-2',
      title: 'Test Article 2',
      favorited: true,
      favoritesCount: 10
    }
  ];

  it('should return the initial state', () => {
    expect(articleListReducer(undefined, {})).toEqual({});
  });

  describe('ARTICLE_FAVORITED action', () => {
    it('should update favorited status and count', () => {
      const initialState = {
        articles: mockArticles,
        articlesCount: 2
      };
      const action = {
        type: ARTICLE_FAVORITED,
        payload: {
          article: {
            slug: 'test-article-1',
            favorited: true,
            favoritesCount: 6
          }
        }
      };
      const newState = articleListReducer(initialState, action);
      expect(newState.articles[0].favorited).toBe(true);
      expect(newState.articles[0].favoritesCount).toBe(6);
      expect(newState.articles[1].favorited).toBe(true); // unchanged
    });

    it('should not modify other articles', () => {
      const initialState = {
        articles: mockArticles
      };
      const action = {
        type: ARTICLE_FAVORITED,
        payload: {
          article: {
            slug: 'test-article-1',
            favorited: true,
            favoritesCount: 6
          }
        }
      };
      const newState = articleListReducer(initialState, action);
      expect(newState.articles[1]).toEqual(mockArticles[1]);
    });
  });

  describe('ARTICLE_UNFAVORITED action', () => {
    it('should update unfavorited status and count', () => {
      const initialState = {
        articles: mockArticles
      };
      const action = {
        type: ARTICLE_UNFAVORITED,
        payload: {
          article: {
            slug: 'test-article-2',
            favorited: false,
            favoritesCount: 9
          }
        }
      };
      const newState = articleListReducer(initialState, action);
      expect(newState.articles[1].favorited).toBe(false);
      expect(newState.articles[1].favoritesCount).toBe(9);
    });
  });

  describe('SET_PAGE action', () => {
    it('should update articles and page number', () => {
      const action = {
        type: SET_PAGE,
        page: 2,
        payload: {
          articles: mockArticles,
          articlesCount: 20
        }
      };
      const newState = articleListReducer({}, action);
      expect(newState.articles).toEqual(mockArticles);
      expect(newState.articlesCount).toBe(20);
      expect(newState.currentPage).toBe(2);
    });

    it('should handle page 0', () => {
      const action = {
        type: SET_PAGE,
        page: 0,
        payload: {
          articles: [],
          articlesCount: 0
        }
      };
      const newState = articleListReducer({}, action);
      expect(newState.currentPage).toBe(0);
      expect(newState.articles).toEqual([]);
    });
  });

  describe('APPLY_TAG_FILTER action', () => {
    it('should filter articles by tag', () => {
      const action = {
        type: APPLY_TAG_FILTER,
        tag: 'react',
        pager: jest.fn(),
        payload: {
          articles: [mockArticles[0]],
          articlesCount: 1
        }
      };
      const newState = articleListReducer({}, action);
      expect(newState.articles).toEqual([mockArticles[0]]);
      expect(newState.articlesCount).toBe(1);
      expect(newState.tag).toBe('react');
      expect(newState.tab).toBe(null);
      expect(newState.currentPage).toBe(0);
    });

    it('should clear previous tab when applying tag filter', () => {
      const initialState = {
        tab: 'feed',
        articles: mockArticles
      };
      const action = {
        type: APPLY_TAG_FILTER,
        tag: 'javascript',
        pager: jest.fn(),
        payload: {
          articles: [],
          articlesCount: 0
        }
      };
      const newState = articleListReducer(initialState, action);
      expect(newState.tab).toBe(null);
      expect(newState.tag).toBe('javascript');
    });
  });

  describe('HOME_PAGE_LOADED action', () => {
    it('should load home page with articles and tags', () => {
      const action = {
        type: HOME_PAGE_LOADED,
        tab: 'all',
        pager: jest.fn(),
        payload: [
          { tags: ['react', 'javascript', 'testing'] },
          { articles: mockArticles, articlesCount: 2 }
        ]
      };
      const newState = articleListReducer({}, action);
      expect(newState.articles).toEqual(mockArticles);
      expect(newState.articlesCount).toBe(2);
      expect(newState.tags).toEqual(['react', 'javascript', 'testing']);
      expect(newState.tab).toBe('all');
      expect(newState.currentPage).toBe(0);
    });

    it('should handle empty payload gracefully', () => {
      const action = {
        type: HOME_PAGE_LOADED,
        tab: 'all',
        pager: jest.fn(),
        payload: null
      };
      const newState = articleListReducer({}, action);
      expect(newState.articles).toEqual([]);
      expect(newState.articlesCount).toBe(0);
      expect(newState.tags).toEqual([]);
    });
  });

  describe('HOME_PAGE_UNLOADED action', () => {
    it('should reset state', () => {
      const initialState = {
        articles: mockArticles,
        articlesCount: 2,
        tags: ['react'],
        currentPage: 2
      };
      const action = { type: HOME_PAGE_UNLOADED };
      const newState = articleListReducer(initialState, action);
      expect(newState).toEqual({});
    });
  });

  describe('CHANGE_TAB action', () => {
    it('should change tab and update articles', () => {
      const action = {
        type: CHANGE_TAB,
        tab: 'feed',
        pager: jest.fn(),
        payload: {
          articles: [mockArticles[0]],
          articlesCount: 1
        }
      };
      const newState = articleListReducer({}, action);
      expect(newState.tab).toBe('feed');
      expect(newState.articles).toEqual([mockArticles[0]]);
      expect(newState.articlesCount).toBe(1);
      expect(newState.currentPage).toBe(0);
      expect(newState.tag).toBe(null);
    });

    it('should clear tag filter when changing tab', () => {
      const initialState = {
        tag: 'react',
        articles: mockArticles
      };
      const action = {
        type: CHANGE_TAB,
        tab: 'global',
        pager: jest.fn(),
        payload: {
          articles: mockArticles,
          articlesCount: 2
        }
      };
      const newState = articleListReducer(initialState, action);
      expect(newState.tag).toBe(null);
      expect(newState.tab).toBe('global');
    });
  });

  describe('PROFILE_PAGE_LOADED action', () => {
    it('should load profile articles', () => {
      const action = {
        type: PROFILE_PAGE_LOADED,
        pager: jest.fn(),
        payload: [
          { profile: { username: 'testuser' } },
          { articles: mockArticles, articlesCount: 2 }
        ]
      };
      const newState = articleListReducer({}, action);
      expect(newState.articles).toEqual(mockArticles);
      expect(newState.articlesCount).toBe(2);
      expect(newState.currentPage).toBe(0);
    });
  });

  describe('PROFILE_PAGE_UNLOADED action', () => {
    it('should reset state', () => {
      const initialState = {
        articles: mockArticles,
        articlesCount: 2
      };
      const action = { type: PROFILE_PAGE_UNLOADED };
      const newState = articleListReducer(initialState, action);
      expect(newState).toEqual({});
    });
  });

  describe('PROFILE_FAVORITES_PAGE_LOADED action', () => {
    it('should load favorited articles', () => {
      const favoritedArticles = [mockArticles[1]];
      const action = {
        type: PROFILE_FAVORITES_PAGE_LOADED,
        pager: jest.fn(),
        payload: [
          { profile: { username: 'testuser' } },
          { articles: favoritedArticles, articlesCount: 1 }
        ]
      };
      const newState = articleListReducer({}, action);
      expect(newState.articles).toEqual(favoritedArticles);
      expect(newState.articlesCount).toBe(1);
    });
  });

  describe('PROFILE_FAVORITES_PAGE_UNLOADED action', () => {
    it('should reset state', () => {
      const initialState = {
        articles: mockArticles,
        articlesCount: 2
      };
      const action = { type: PROFILE_FAVORITES_PAGE_UNLOADED };
      const newState = articleListReducer(initialState, action);
      expect(newState).toEqual({});
    });
  });
});
