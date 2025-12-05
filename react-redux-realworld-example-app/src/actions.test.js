import configureMockStore from 'redux-mock-store';
import { promiseMiddleware } from './middleware';
import * as types from './constants/actionTypes';
import agent from './agent';

// Mock the agent
jest.mock('./agent');

const mockStore = configureMockStore([promiseMiddleware]);

describe('Redux Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Actions', () => {
    test('should dispatch LOGIN action on successful login', () => {
      const store = mockStore({});
      const mockUser = {
        email: 'test@test.com',
        token: 'jwt-token',
        username: 'testuser'
      };

      agent.Auth = {
        login: jest.fn().mockResolvedValue({ user: mockUser })
      };

      const expectedActions = [
        { type: types.ASYNC_START, subtype: types.LOGIN }
      ];

      const action = {
        type: types.LOGIN,
        payload: agent.Auth.login('test@test.com', 'password')
      };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0].type).toBe(expectedActions[0].type);
    });

    test('should dispatch REGISTER action on successful registration', () => {
      const store = mockStore({});
      const mockUser = {
        email: 'new@test.com',
        token: 'jwt-token',
        username: 'newuser'
      };

      agent.Auth = {
        register: jest.fn().mockResolvedValue({ user: mockUser })
      };

      const action = {
        type: types.REGISTER,
        payload: agent.Auth.register('newuser', 'new@test.com', 'password')
      };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0].type).toBe(types.ASYNC_START);
    });

    test('should dispatch LOGOUT action', () => {
      const store = mockStore({});
      const action = { type: types.LOGOUT };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0]).toEqual(action);
    });

    test('should dispatch UPDATE_FIELD_AUTH action', () => {
      const store = mockStore({});
      const action = {
        type: types.UPDATE_FIELD_AUTH,
        key: 'email',
        value: 'test@test.com'
      };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0]).toEqual(action);
      expect(actions[0].key).toBe('email');
      expect(actions[0].value).toBe('test@test.com');
    });
  });

  describe('Article Actions', () => {
    test('should dispatch ARTICLE_FAVORITED action', () => {
      const store = mockStore({});
      const mockArticle = {
        slug: 'test-article',
        favorited: true,
        favoritesCount: 6
      };

      agent.Articles = {
        favorite: jest.fn().mockResolvedValue({ article: mockArticle })
      };

      const action = {
        type: types.ARTICLE_FAVORITED,
        payload: agent.Articles.favorite('test-article')
      };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0].type).toBe(types.ASYNC_START);
    });

    test('should dispatch ARTICLE_UNFAVORITED action', () => {
      const store = mockStore({});
      const mockArticle = {
        slug: 'test-article',
        favorited: false,
        favoritesCount: 5
      };

      agent.Articles = {
        unfavorite: jest.fn().mockResolvedValue({ article: mockArticle })
      };

      const action = {
        type: types.ARTICLE_UNFAVORITED,
        payload: agent.Articles.unfavorite('test-article')
      };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0].type).toBe(types.ASYNC_START);
    });
  });

  describe('Editor Actions', () => {
    test('should dispatch UPDATE_FIELD_EDITOR action', () => {
      const store = mockStore({});
      const action = {
        type: types.UPDATE_FIELD_EDITOR,
        key: 'title',
        value: 'New Article Title'
      };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0]).toEqual(action);
      expect(actions[0].key).toBe('title');
      expect(actions[0].value).toBe('New Article Title');
    });

    test('should dispatch ADD_TAG action', () => {
      const store = mockStore({});
      const action = { type: types.ADD_TAG };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0]).toEqual(action);
    });

    test('should dispatch REMOVE_TAG action', () => {
      const store = mockStore({});
      const action = {
        type: types.REMOVE_TAG,
        tag: 'react'
      };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0]).toEqual(action);
      expect(actions[0].tag).toBe('react');
    });
  });

  describe('Async Actions', () => {
    test('should dispatch ASYNC_START action', () => {
      const store = mockStore({});
      const action = {
        type: types.ASYNC_START,
        subtype: types.LOGIN
      };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0]).toEqual(action);
      expect(actions[0].subtype).toBe(types.LOGIN);
    });

    test('should dispatch ASYNC_END action', () => {
      const store = mockStore({});
      const action = {
        type: types.ASYNC_END,
        promise: { data: 'test' }
      };

      store.dispatch(action);
      const actions = store.getActions();
      expect(actions[0]).toEqual(action);
    });
  });
});
