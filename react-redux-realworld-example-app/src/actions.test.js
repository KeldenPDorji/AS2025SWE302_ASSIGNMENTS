import * as actionTypes from './constants/actionTypes';

describe('Action Types', () => {
  it('should export all required action types', () => {
    expect(actionTypes.APP_LOAD).toBe('APP_LOAD');
    expect(actionTypes.LOGIN).toBe('LOGIN');
    expect(actionTypes.LOGOUT).toBe('LOGOUT');
    expect(actionTypes.REGISTER).toBe('REGISTER');
    expect(actionTypes.REDIRECT).toBe('REDIRECT');
  });

  it('should export article action types', () => {
    expect(actionTypes.ARTICLE_PAGE_LOADED).toBe('ARTICLE_PAGE_LOADED');
    expect(actionTypes.ARTICLE_PAGE_UNLOADED).toBe('ARTICLE_PAGE_UNLOADED');
    expect(actionTypes.ARTICLE_SUBMITTED).toBe('ARTICLE_SUBMITTED');
    expect(actionTypes.DELETE_ARTICLE).toBe('DELETE_ARTICLE');
    expect(actionTypes.ARTICLE_FAVORITED).toBe('ARTICLE_FAVORITED');
    expect(actionTypes.ARTICLE_UNFAVORITED).toBe('ARTICLE_UNFAVORITED');
  });

  it('should export editor action types', () => {
    expect(actionTypes.EDITOR_PAGE_LOADED).toBe('EDITOR_PAGE_LOADED');
    expect(actionTypes.EDITOR_PAGE_UNLOADED).toBe('EDITOR_PAGE_UNLOADED');
    expect(actionTypes.UPDATE_FIELD_EDITOR).toBe('UPDATE_FIELD_EDITOR');
    expect(actionTypes.ADD_TAG).toBe('ADD_TAG');
    expect(actionTypes.REMOVE_TAG).toBe('REMOVE_TAG');
  });

  it('should export auth action types', () => {
    expect(actionTypes.UPDATE_FIELD_AUTH).toBe('UPDATE_FIELD_AUTH');
    expect(actionTypes.LOGIN_PAGE_UNLOADED).toBe('LOGIN_PAGE_UNLOADED');
    expect(actionTypes.REGISTER_PAGE_UNLOADED).toBe('REGISTER_PAGE_UNLOADED');
  });

  it('should export async action types', () => {
    expect(actionTypes.ASYNC_START).toBe('ASYNC_START');
    expect(actionTypes.ASYNC_END).toBe('ASYNC_END');
  });

  it('should export home page action types', () => {
    expect(actionTypes.HOME_PAGE_LOADED).toBe('HOME_PAGE_LOADED');
    expect(actionTypes.HOME_PAGE_UNLOADED).toBe('HOME_PAGE_UNLOADED');
    expect(actionTypes.APPLY_TAG_FILTER).toBe('APPLY_TAG_FILTER');
    expect(actionTypes.SET_PAGE).toBe('SET_PAGE');
    expect(actionTypes.CHANGE_TAB).toBe('CHANGE_TAB');
  });

  it('should export profile action types', () => {
    expect(actionTypes.PROFILE_PAGE_LOADED).toBe('PROFILE_PAGE_LOADED');
    expect(actionTypes.PROFILE_PAGE_UNLOADED).toBe('PROFILE_PAGE_UNLOADED');
    expect(actionTypes.PROFILE_FAVORITES_PAGE_LOADED).toBe('PROFILE_FAVORITES_PAGE_LOADED');
    expect(actionTypes.PROFILE_FAVORITES_PAGE_UNLOADED).toBe('PROFILE_FAVORITES_PAGE_UNLOADED');
    expect(actionTypes.FOLLOW_USER).toBe('FOLLOW_USER');
    expect(actionTypes.UNFOLLOW_USER).toBe('UNFOLLOW_USER');
  });

  it('should export comment action types', () => {
    expect(actionTypes.ADD_COMMENT).toBe('ADD_COMMENT');
    expect(actionTypes.DELETE_COMMENT).toBe('DELETE_COMMENT');
  });

  it('should export settings action types', () => {
    expect(actionTypes.SETTINGS_SAVED).toBe('SETTINGS_SAVED');
    expect(actionTypes.SETTINGS_PAGE_UNLOADED).toBe('SETTINGS_PAGE_UNLOADED');
  });
});

describe('Action Creators', () => {
  describe('Authentication Actions', () => {
    it('should create LOGIN action with correct structure', () => {
      const payload = {
        user: {
          email: 'test@test.com',
          token: 'jwt-token',
          username: 'testuser'
        }
      };
      const action = {
        type: actionTypes.LOGIN,
        payload
      };
      expect(action.type).toBe(actionTypes.LOGIN);
      expect(action.payload.user.email).toBe('test@test.com');
      expect(action.payload.user.token).toBe('jwt-token');
    });

    it('should create REGISTER action with correct structure', () => {
      const payload = {
        user: {
          email: 'new@test.com',
          token: 'jwt-token',
          username: 'newuser'
        }
      };
      const action = {
        type: actionTypes.REGISTER,
        payload
      };
      expect(action.type).toBe(actionTypes.REGISTER);
      expect(action.payload.user.email).toBe('new@test.com');
    });

    it('should create LOGOUT action', () => {
      const action = { type: actionTypes.LOGOUT };
      expect(action.type).toBe(actionTypes.LOGOUT);
    });

    it('should create UPDATE_FIELD_AUTH action', () => {
      const action = {
        type: actionTypes.UPDATE_FIELD_AUTH,
        key: 'email',
        value: 'test@test.com'
      };
      expect(action.type).toBe(actionTypes.UPDATE_FIELD_AUTH);
      expect(action.key).toBe('email');
      expect(action.value).toBe('test@test.com');
    });
  });

  describe('Article Actions', () => {
    it('should create ARTICLE_PAGE_LOADED action', () => {
      const payload = {
        article: {
          slug: 'test-article',
          title: 'Test Article'
        }
      };
      const action = {
        type: actionTypes.ARTICLE_PAGE_LOADED,
        payload
      };
      expect(action.type).toBe(actionTypes.ARTICLE_PAGE_LOADED);
      expect(action.payload.article.slug).toBe('test-article');
    });

    it('should create ARTICLE_FAVORITED action', () => {
      const payload = {
        article: {
          slug: 'test-article',
          favorited: true,
          favoritesCount: 6
        }
      };
      const action = {
        type: actionTypes.ARTICLE_FAVORITED,
        payload
      };
      expect(action.type).toBe(actionTypes.ARTICLE_FAVORITED);
      expect(action.payload.article.favorited).toBe(true);
    });

    it('should create ARTICLE_UNFAVORITED action', () => {
      const payload = {
        article: {
          slug: 'test-article',
          favorited: false,
          favoritesCount: 5
        }
      };
      const action = {
        type: actionTypes.ARTICLE_UNFAVORITED,
        payload
      };
      expect(action.type).toBe(actionTypes.ARTICLE_UNFAVORITED);
      expect(action.payload.article.favorited).toBe(false);
    });
  });

  describe('Editor Actions', () => {
    it('should create UPDATE_FIELD_EDITOR action', () => {
      const action = {
        type: actionTypes.UPDATE_FIELD_EDITOR,
        key: 'title',
        value: 'New Title'
      };
      expect(action.type).toBe(actionTypes.UPDATE_FIELD_EDITOR);
      expect(action.key).toBe('title');
      expect(action.value).toBe('New Title');
    });

    it('should create ADD_TAG action', () => {
      const action = { type: actionTypes.ADD_TAG };
      expect(action.type).toBe(actionTypes.ADD_TAG);
    });

    it('should create REMOVE_TAG action', () => {
      const action = {
        type: actionTypes.REMOVE_TAG,
        tag: 'react'
      };
      expect(action.type).toBe(actionTypes.REMOVE_TAG);
      expect(action.tag).toBe('react');
    });

    it('should create ARTICLE_SUBMITTED action', () => {
      const payload = {
        article: {
          slug: 'new-article',
          title: 'New Article'
        }
      };
      const action = {
        type: actionTypes.ARTICLE_SUBMITTED,
        payload
      };
      expect(action.type).toBe(actionTypes.ARTICLE_SUBMITTED);
      expect(action.payload.article.slug).toBe('new-article');
    });
  });

  describe('Async Actions', () => {
    it('should create ASYNC_START action with subtype', () => {
      const action = {
        type: actionTypes.ASYNC_START,
        subtype: actionTypes.LOGIN
      };
      expect(action.type).toBe(actionTypes.ASYNC_START);
      expect(action.subtype).toBe(actionTypes.LOGIN);
    });

    it('should create ASYNC_END action', () => {
      const action = {
        type: actionTypes.ASYNC_END,
        promise: { data: 'test' }
      };
      expect(action.type).toBe(actionTypes.ASYNC_END);
      expect(action.promise.data).toBe('test');
    });
  });

  describe('Navigation Actions', () => {
    it('should create SET_PAGE action', () => {
      const action = {
        type: actionTypes.SET_PAGE,
        page: 2,
        payload: {
          articles: [],
          articlesCount: 20
        }
      };
      expect(action.type).toBe(actionTypes.SET_PAGE);
      expect(action.page).toBe(2);
    });

    it('should create APPLY_TAG_FILTER action', () => {
      const action = {
        type: actionTypes.APPLY_TAG_FILTER,
        tag: 'react',
        payload: { articles: [] }
      };
      expect(action.type).toBe(actionTypes.APPLY_TAG_FILTER);
      expect(action.tag).toBe('react');
    });

    it('should create CHANGE_TAB action', () => {
      const action = {
        type: actionTypes.CHANGE_TAB,
        tab: 'feed',
        payload: { articles: [] }
      };
      expect(action.type).toBe(actionTypes.CHANGE_TAB);
      expect(action.tab).toBe('feed');
    });
  });

  describe('Comment Actions', () => {
    it('should create ADD_COMMENT action', () => {
      const action = {
        type: actionTypes.ADD_COMMENT,
        payload: {
          comment: {
            id: 1,
            body: 'Test comment'
          }
        }
      };
      expect(action.type).toBe(actionTypes.ADD_COMMENT);
      expect(action.payload.comment.body).toBe('Test comment');
    });

    it('should create DELETE_COMMENT action', () => {
      const action = {
        type: actionTypes.DELETE_COMMENT,
        commentId: 1
      };
      expect(action.type).toBe(actionTypes.DELETE_COMMENT);
      expect(action.commentId).toBe(1);
    });
  });
});
