import { promiseMiddleware, localStorageMiddleware } from './middleware';
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  REGISTER
} from './constants/actionTypes';
import agent from './agent';

// Mock agent
jest.mock('./agent', () => ({
  setToken: jest.fn()
}));

describe('promiseMiddleware', () => {
  let store;
  let next;

  beforeEach(() => {
    store = {
      dispatch: jest.fn(),
      getState: jest.fn(() => ({
        viewChangeCounter: 1
      }))
    };
    next = jest.fn();
  });

  it('should pass non-promise actions to next', () => {
    const action = { type: 'SOME_ACTION', payload: 'data' };
    promiseMiddleware(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should handle promise actions with success', async () => {
    const resolvedValue = { user: { email: 'test@test.com' } };
    const promise = Promise.resolve(resolvedValue);
    const action = {
      type: LOGIN,
      payload: promise
    };

    promiseMiddleware(store)(next)(action);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: ASYNC_START,
      subtype: LOGIN
    });

    await promise;
    // Give time for promise handlers to execute
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(store.dispatch).toHaveBeenCalledWith({
      type: ASYNC_END,
      promise: resolvedValue
    });
  });

  it('should handle promise actions with error', async () => {
    const error = {
      response: {
        body: { errors: { 'email or password': ['is invalid'] } }
      }
    };
    const promise = Promise.reject(error);
    const action = {
      type: LOGIN,
      payload: promise
    };

    promiseMiddleware(store)(next)(action);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: ASYNC_START,
      subtype: LOGIN
    });

    try {
      await promise;
    } catch (e) {
      // Expected error
    }
    // Give time for promise handlers to execute
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(store.dispatch).toHaveBeenCalledWith({
      type: ASYNC_END,
      promise: error.response.body
    });
  });

  it('should handle error without response body', async () => {
    const error = { message: 'Network error' };
    const promise = Promise.reject(error);
    const action = {
      type: LOGIN,
      payload: promise
    };

    promiseMiddleware(store)(next)(action);

    try {
      await promise;
    } catch (e) {
      // Expected error
    }
    await new Promise(resolve => setTimeout(resolve, 0));

    // Should use default error message
    const calls = store.dispatch.mock.calls;
    const errorAction = calls.find(call => call[0].error === true);
    expect(errorAction).toBeTruthy();
  });

  it('should skip outdated requests when view changes', async () => {
    const resolvedValue = { data: 'test' };
    const promise = Promise.resolve(resolvedValue);
    const action = {
      type: 'SOME_ASYNC_ACTION',
      payload: promise
    };

    // Initial view counter is 1
    store.getState.mockReturnValueOnce({ viewChangeCounter: 1 });
    promiseMiddleware(store)(next)(action);

    // Change view counter before promise resolves
    store.getState.mockReturnValue({ viewChangeCounter: 2 });

    await promise;
    await new Promise(resolve => setTimeout(resolve, 0));

    // Should not dispatch the action since view changed
    const actionDispatches = store.dispatch.mock.calls.filter(
      call => call[0].type !== ASYNC_START
    );
    expect(actionDispatches.length).toBe(0);
  });

  it('should not skip tracking when skipTracking is true', async () => {
    const resolvedValue = { data: 'test' };
    const promise = Promise.resolve(resolvedValue);
    const action = {
      type: 'SOME_ASYNC_ACTION',
      payload: promise,
      skipTracking: true
    };

    store.getState.mockReturnValueOnce({ viewChangeCounter: 1 });
    promiseMiddleware(store)(next)(action);
    store.getState.mockReturnValue({ viewChangeCounter: 2 });

    await promise;
    await new Promise(resolve => setTimeout(resolve, 0));

    // Should still dispatch even though view changed
    expect(store.dispatch).toHaveBeenCalled();
  });
});

describe('localStorageMiddleware', () => {
  let store;
  let next;

  beforeEach(() => {
    store = {
      dispatch: jest.fn(),
      getState: jest.fn()
    };
    next = jest.fn();
    // Clear localStorage
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it('should save token on successful LOGIN', () => {
    const action = {
      type: LOGIN,
      error: false,
      payload: {
        user: {
          email: 'test@test.com',
          token: 'jwt-token-123'
        }
      }
    };

    localStorageMiddleware(store)(next)(action);

    expect(window.localStorage.getItem('jwt')).toBe('jwt-token-123');
    expect(agent.setToken).toHaveBeenCalledWith('jwt-token-123');
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should save token on successful REGISTER', () => {
    const action = {
      type: REGISTER,
      error: false,
      payload: {
        user: {
          email: 'newuser@test.com',
          token: 'jwt-token-456'
        }
      }
    };

    localStorageMiddleware(store)(next)(action);

    expect(window.localStorage.getItem('jwt')).toBe('jwt-token-456');
    expect(agent.setToken).toHaveBeenCalledWith('jwt-token-456');
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should not save token on failed LOGIN', () => {
    const action = {
      type: LOGIN,
      error: true,
      payload: {
        errors: { 'email or password': ['is invalid'] }
      }
    };

    localStorageMiddleware(store)(next)(action);

    expect(window.localStorage.getItem('jwt')).toBe(null);
    expect(agent.setToken).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should not save token on failed REGISTER', () => {
    const action = {
      type: REGISTER,
      error: true,
      payload: {
        errors: { email: ['has already been taken'] }
      }
    };

    localStorageMiddleware(store)(next)(action);

    expect(window.localStorage.getItem('jwt')).toBe(null);
    expect(agent.setToken).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should clear token on LOGOUT', () => {
    // First set a token
    window.localStorage.setItem('jwt', 'existing-token');

    const action = { type: LOGOUT };

    localStorageMiddleware(store)(next)(action);

    expect(window.localStorage.getItem('jwt')).toBe('');
    expect(agent.setToken).toHaveBeenCalledWith(null);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass through other actions unchanged', () => {
    const action = { type: 'SOME_OTHER_ACTION', payload: 'data' };

    localStorageMiddleware(store)(next)(action);

    expect(window.localStorage.getItem('jwt')).toBe(null);
    expect(agent.setToken).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should update localStorage when logging in multiple times', () => {
    const action1 = {
      type: LOGIN,
      error: false,
      payload: { user: { token: 'token-1' } }
    };
    localStorageMiddleware(store)(next)(action1);
    expect(window.localStorage.getItem('jwt')).toBe('token-1');

    const action2 = {
      type: LOGIN,
      error: false,
      payload: { user: { token: 'token-2' } }
    };
    localStorageMiddleware(store)(next)(action2);
    expect(window.localStorage.getItem('jwt')).toBe('token-2');
  });
});
