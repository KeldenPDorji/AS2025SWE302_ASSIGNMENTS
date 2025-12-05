import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import Login from './components/Login';
import Editor from './components/Editor';
import ArticleList from './components/ArticleList';
import {
  LOGIN,
  REGISTER,
  UPDATE_FIELD_AUTH,
  ARTICLE_SUBMITTED,
  UPDATE_FIELD_EDITOR,
  ARTICLE_FAVORITED
} from './constants/actionTypes';

const middlewares = [promiseMiddleware, localStorageMiddleware];
const mockStore = configureStore(middlewares);

describe('Frontend Integration Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('should update Redux state when email field changes', () => {
      const initialState = {
        auth: {
          email: '',
          password: ''
        },
        common: {
          redirectTo: null
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>
      );

      const emailInput = wrapper.find('input[type="email"]').first();
      emailInput.simulate('change', { target: { value: 'test@test.com' } });

      const actions = store.getActions();
      const updateAction = actions.find(a => a.type === UPDATE_FIELD_AUTH && a.key === 'email');
      expect(updateAction).toBeTruthy();
      expect(updateAction.value).toBe('test@test.com');
    });

    it('should update Redux state when password field changes', () => {
      const initialState = {
        auth: {
          email: '',
          password: ''
        },
        common: {
          redirectTo: null
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>
      );

      const passwordInput = wrapper.find('input[type="password"]').first();
      passwordInput.simulate('change', { target: { value: 'password123' } });

      const actions = store.getActions();
      const updateAction = actions.find(a => a.type === UPDATE_FIELD_AUTH && a.key === 'password');
      expect(updateAction).toBeTruthy();
      expect(updateAction.value).toBe('password123');
    });

    it('should dispatch LOGIN action on form submission', () => {
      const testPassword = process.env.TEST_PASSWORD || 'test-pwd-' + Date.now();
      const initialState = {
        auth: {
          email: 'test@test.com',
          password: testPassword,
          inProgress: false
        },
        common: {
          redirectTo: null
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>
      );

      const form = wrapper.find('form').first();
      form.simulate('submit', { preventDefault: jest.fn() });

      const actions = store.getActions();
      const loginAction = actions.find(a => a.type === LOGIN);
      expect(loginAction).toBeTruthy();
    });

    it('should disable submit button when login is in progress', () => {
      const testPassword = process.env.TEST_PASSWORD || 'test-pwd-' + Date.now();
      const initialState = {
        auth: {
          email: 'test@test.com',
          password: testPassword,
          inProgress: true
        },
        common: {
          redirectTo: null
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>
      );

      const submitButton = wrapper.find('button[type="submit"]').first();
      expect(submitButton.prop('disabled')).toBe(true);
    });

    it('should display errors when login fails', () => {
      const testPassword = process.env.TEST_PASSWORD || 'test-pwd-' + Date.now();
      const initialState = {
        auth: {
          email: 'test@test.com',
          password: testPassword,
          inProgress: false,
          errors: {
            'email or password': ['is invalid']
          }
        },
        common: {
          redirectTo: null
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>
      );

      const errorList = wrapper.find('.error-messages');
      expect(errorList.exists()).toBe(true);
    });
  });

  describe('Article Creation Flow', () => {
    it('should update title field in Redux state', () => {
      const initialState = {
        editor: {
          title: '',
          description: '',
          body: '',
          tagInput: '',
          tagList: [],
          inProgress: false
        },
        common: {
          currentUser: {
            email: 'test@test.com',
            token: 'jwt-token'
          }
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Editor match={{ params: {} }} />
          </MemoryRouter>
        </Provider>
      );

      const titleInput = wrapper.find('input[placeholder="Article Title"]').first();
      titleInput.simulate('change', { target: { value: 'My New Article' } });

      const actions = store.getActions();
      const updateAction = actions.find(a => a.type === UPDATE_FIELD_EDITOR && a.key === 'title');
      expect(updateAction).toBeTruthy();
      expect(updateAction.value).toBe('My New Article');
    });

    it('should update description field in Redux state', () => {
      const initialState = {
        editor: {
          title: '',
          description: '',
          body: '',
          tagInput: '',
          tagList: [],
          inProgress: false
        },
        common: {
          currentUser: {
            email: 'test@test.com',
            token: 'jwt-token'
          }
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Editor match={{ params: {} }} />
          </MemoryRouter>
        </Provider>
      );

      const descInput = wrapper.find('input[placeholder="What\'s this article about?"]').first();
      descInput.simulate('change', { target: { value: 'Article description' } });

      const actions = store.getActions();
      const updateAction = actions.find(a => a.type === UPDATE_FIELD_EDITOR && a.key === 'description');
      expect(updateAction).toBeTruthy();
      expect(updateAction.value).toBe('Article description');
    });

    it('should update body field in Redux state', () => {
      const initialState = {
        editor: {
          title: '',
          description: '',
          body: '',
          tagInput: '',
          tagList: [],
          inProgress: false
        },
        common: {
          currentUser: {
            email: 'test@test.com',
            token: 'jwt-token'
          }
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Editor match={{ params: {} }} />
          </MemoryRouter>
        </Provider>
      );

      const bodyTextarea = wrapper.find('textarea').first();
      bodyTextarea.simulate('change', { target: { value: 'Article body content' } });

      const actions = store.getActions();
      const updateAction = actions.find(a => a.type === UPDATE_FIELD_EDITOR && a.key === 'body');
      expect(updateAction).toBeTruthy();
      expect(updateAction.value).toBe('Article body content');
    });

    it('should dispatch ARTICLE_SUBMITTED on form submission', () => {
      const initialState = {
        editor: {
          title: 'Test Article',
          description: 'Test Description',
          body: 'Test Body',
          tagInput: '',
          tagList: ['react'],
          inProgress: false
        },
        common: {
          currentUser: {
            email: 'test@test.com',
            token: 'jwt-token'
          }
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Editor match={{ params: {} }} />
          </MemoryRouter>
        </Provider>
      );

      const submitButton = wrapper.find('button[type="button"]').first();
      submitButton.simulate('click', { preventDefault: jest.fn() });

      const actions = store.getActions();
      const submitAction = actions.find(a => a.type === ARTICLE_SUBMITTED);
      expect(submitAction).toBeTruthy();
    });

    it('should disable submit button when article submission is in progress', () => {
      const initialState = {
        editor: {
          title: 'Test Article',
          description: 'Test Description',
          body: 'Test Body',
          tagInput: '',
          tagList: [],
          inProgress: true
        },
        common: {
          currentUser: {
            email: 'test@test.com',
            token: 'jwt-token'
          }
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Editor match={{ params: {} }} />
          </MemoryRouter>
        </Provider>
      );

      const submitButton = wrapper.find('button[type="button"]').first();
      expect(submitButton.prop('disabled')).toBe(true);
    });
  });

  describe('Article Favorite Flow', () => {
    const mockArticle = {
      slug: 'test-article',
      title: 'Test Article',
      description: 'Test description',
      body: 'Test body',
      tagList: ['react'],
      createdAt: '2025-01-01',
      favorited: false,
      favoritesCount: 5,
      author: {
        username: 'testuser',
        bio: 'Test bio',
        image: 'https://via.placeholder.com/150',
        following: false
      }
    };

    it('should render article with favorite button', () => {
      const initialState = {
        articleList: {
          articles: [mockArticle],
          articlesCount: 1
        },
        common: {
          currentUser: {
            email: 'test@test.com',
            token: 'jwt-token'
          }
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ArticleList 
              articles={[mockArticle]}
              loading={false}
              articlesCount={1}
              currentPage={0}
            />
          </MemoryRouter>
        </Provider>
      );

      const favoriteButton = wrapper.find('button.btn-sm');
      expect(favoriteButton.exists()).toBe(true);
    });

    it('should show correct favorite count', () => {
      const initialState = {
        articleList: {
          articles: [mockArticle],
          articlesCount: 1
        },
        common: {
          currentUser: null
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ArticleList 
              articles={[mockArticle]}
              loading={false}
              articlesCount={1}
              currentPage={0}
            />
          </MemoryRouter>
        </Provider>
      );

      const favoriteCount = wrapper.find('button.btn-sm').first().text();
      expect(favoriteCount).toContain('5');
    });

    it('should dispatch ARTICLE_FAVORITED when favorite button is clicked', () => {
      const initialState = {
        articleList: {
          articles: [mockArticle],
          articlesCount: 1
        },
        common: {
          currentUser: {
            email: 'test@test.com',
            token: 'jwt-token'
          }
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ArticleList 
              articles={[mockArticle]}
              loading={false}
              articlesCount={1}
              currentPage={0}
              onSetPage={jest.fn()}
            />
          </MemoryRouter>
        </Provider>
      );

      const favoriteButton = wrapper.find('button.btn-sm').first();
      favoriteButton.simulate('click', { preventDefault: jest.fn() });

      const actions = store.getActions();
      const favoriteAction = actions.find(a => a.type === ARTICLE_FAVORITED);
      expect(favoriteAction).toBeTruthy();
    });

    it('should update UI when article is favorited', () => {
      const favoritedArticle = {
        ...mockArticle,
        favorited: true,
        favoritesCount: 6
      };

      const initialState = {
        articleList: {
          articles: [favoritedArticle],
          articlesCount: 1
        },
        common: {
          currentUser: {
            email: 'test@test.com',
            token: 'jwt-token'
          }
        }
      };
      const store = mockStore(initialState);

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <ArticleList 
              articles={[favoritedArticle]}
              loading={false}
              articlesCount={1}
              currentPage={0}
            />
          </MemoryRouter>
        </Provider>
      );

      const favoriteButton = wrapper.find('button.btn-sm').first();
      expect(favoriteButton.hasClass('btn-primary')).toBe(true);
      expect(favoriteButton.text()).toContain('6');
    });
  });

  describe('Full User Journey', () => {
    it('should complete login to article creation flow', () => {
      // Step 1: Login
      const testPassword = process.env.TEST_PASSWORD || 'test-pwd-' + Date.now();
      const loginState = {
        auth: {
          email: 'test@test.com',
          password: testPassword,
          inProgress: false
        },
        common: {
          redirectTo: null
        }
      };
      const store = mockStore(loginState);

      let wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>
      );

      // Fill in login form
      wrapper.find('input[type="email"]').first().simulate('change', {
        target: { value: 'test@test.com' }
      });
      wrapper.find('input[type="password"]').first().simulate('change', {
        target: { value: 'password123' }
      });
      wrapper.find('form').first().simulate('submit', { preventDefault: jest.fn() });

      const loginActions = store.getActions();
      expect(loginActions.some(a => a.type === LOGIN)).toBe(true);

      // Step 2: Navigate to Editor
      const editorState = {
        editor: {
          title: '',
          description: '',
          body: '',
          tagInput: '',
          tagList: [],
          inProgress: false
        },
        common: {
          currentUser: {
            email: 'test@test.com',
            token: 'jwt-token'
          }
        }
      };
      const editorStore = mockStore(editorState);

      wrapper = mount(
        <Provider store={editorStore}>
          <MemoryRouter>
            <Editor match={{ params: {} }} />
          </MemoryRouter>
        </Provider>
      );

      // Fill in article form
      wrapper.find('input[placeholder="Article Title"]').first().simulate('change', {
        target: { value: 'My First Article' }
      });

      const editorActions = editorStore.getActions();
      expect(editorActions.some(a => a.type === UPDATE_FIELD_EDITOR)).toBe(true);
    });
  });
});
