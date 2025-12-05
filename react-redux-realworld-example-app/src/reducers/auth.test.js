import authReducer from '../reducers/auth';
import {
  LOGIN,
  REGISTER,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  ASYNC_START,
  UPDATE_FIELD_AUTH
} from '../constants/actionTypes';

describe('auth reducer', () => {
  test('should return the initial state', () => {
    expect(authReducer(undefined, {})).toEqual({});
  });

  describe('LOGIN action', () => {
    test('should handle successful LOGIN', () => {
      const action = {
        type: LOGIN,
        error: false,
        payload: {
          user: {
            email: 'test@test.com',
            token: 'jwt-token-123',
            username: 'testuser'
          }
        }
      };
      const newState = authReducer({}, action);
      expect(newState.inProgress).toBe(false);
      expect(newState.errors).toBe(null);
    });

    test('should handle LOGIN with errors', () => {
      const action = {
        type: LOGIN,
        error: true,
        payload: {
          errors: {
            'email or password': ['is invalid']
          }
        }
      };
      const newState = authReducer({}, action);
      expect(newState.inProgress).toBe(false);
      expect(newState.errors).toEqual({
        'email or password': ['is invalid']
      });
    });

    test('should handle LOGIN error without payload', () => {
      const action = {
        type: LOGIN,
        error: true
      };
      const newState = authReducer({}, action);
      expect(newState.inProgress).toBe(false);
      expect(newState.errors).toBe(null);
    });
  });

  describe('REGISTER action', () => {
    test('should handle successful REGISTER', () => {
      const action = {
        type: REGISTER,
        error: false,
        payload: {
          user: {
            email: 'newuser@test.com',
            token: 'jwt-token-456',
            username: 'newuser'
          }
        }
      };
      const newState = authReducer({}, action);
      expect(newState.inProgress).toBe(false);
      expect(newState.errors).toBe(null);
    });

    test('should handle REGISTER with validation errors', () => {
      const action = {
        type: REGISTER,
        error: true,
        payload: {
          errors: {
            username: ['has already been taken'],
            email: ['has already been taken']
          }
        }
      };
      const newState = authReducer({}, action);
      expect(newState.inProgress).toBe(false);
      expect(newState.errors).toEqual({
        username: ['has already been taken'],
        email: ['has already been taken']
      });
    });
  });

  describe('ASYNC_START action', () => {
    test('should set inProgress to true for LOGIN subtype', () => {
      const action = {
        type: ASYNC_START,
        subtype: LOGIN
      };
      const initialState = { email: 'test@test.com' };
      const newState = authReducer(initialState, action);
      expect(newState.inProgress).toBe(true);
      expect(newState.email).toBe('test@test.com');
    });

    test('should set inProgress to true for REGISTER subtype', () => {
      const action = {
        type: ASYNC_START,
        subtype: REGISTER
      };
      const initialState = { username: 'testuser' };
      const newState = authReducer(initialState, action);
      expect(newState.inProgress).toBe(true);
      expect(newState.username).toBe('testuser');
    });

    test('should not modify state for other subtypes', () => {
      const action = {
        type: ASYNC_START,
        subtype: 'SOME_OTHER_ACTION'
      };
      const initialState = { email: 'test@test.com' };
      const newState = authReducer(initialState, action);
      expect(newState).toEqual(initialState);
    });
  });

  describe('UPDATE_FIELD_AUTH action', () => {
    test('should update email field', () => {
      const action = {
        type: UPDATE_FIELD_AUTH,
        key: 'email',
        value: 'newemail@test.com'
      };
      const newState = authReducer({}, action);
      expect(newState.email).toBe('newemail@test.com');
    });

    test('should update password field', () => {
      const action = {
        type: UPDATE_FIELD_AUTH,
        key: 'password',
        value: 'newpassword123'
      };
      const newState = authReducer({}, action);
      expect(newState.password).toBe('newpassword123');
    });

    test('should update username field', () => {
      const action = {
        type: UPDATE_FIELD_AUTH,
        key: 'username',
        value: 'newusername'
      };
      const newState = authReducer({}, action);
      expect(newState.username).toBe('newusername');
    });

    test('should preserve existing state when updating', () => {
      const action = {
        type: UPDATE_FIELD_AUTH,
        key: 'password',
        value: 'newpass'
      };
      const initialState = { email: 'existing@test.com', username: 'existinguser' };
      const newState = authReducer(initialState, action);
      expect(newState.email).toBe('existing@test.com');
      expect(newState.username).toBe('existinguser');
      expect(newState.password).toBe('newpass');
    });
  });

  describe('Page unload actions', () => {
    test('should reset state on LOGIN_PAGE_UNLOADED', () => {
      const action = { type: LOGIN_PAGE_UNLOADED };
      const initialState = {
        email: 'test@test.com',
        password: 'password',
        inProgress: false
      };
      const newState = authReducer(initialState, action);
      expect(newState).toEqual({});
    });

    test('should reset state on REGISTER_PAGE_UNLOADED', () => {
      const action = { type: REGISTER_PAGE_UNLOADED };
      const initialState = {
        email: 'test@test.com',
        username: 'testuser',
        password: 'password',
        errors: { email: ['invalid'] }
      };
      const newState = authReducer(initialState, action);
      expect(newState).toEqual({});
    });
  });
});
