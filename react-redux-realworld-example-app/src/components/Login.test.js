import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Login from './Login';

describe('Login Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Form rendering
  test('should render the login form', () => {
    const preloadedState = {
      auth: { email: '', password: '', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('should render email input field', () => {
    const preloadedState = {
      auth: { email: '', password: '', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  test('should render password input field', () => {
    const preloadedState = {
      auth: { email: '', password: '', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('should render submit button', () => {
    const preloadedState = {
      auth: { email: '', password: '', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('should render link to register page', () => {
    const preloadedState = {
      auth: { email: '', password: '', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    expect(screen.getByText('Need an account?')).toBeInTheDocument();
  });

  test('should render "Sign In" heading', () => {
    const preloadedState = {
      auth: { email: '', password: '', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  // Test 2: Input field updates
  test('should update email input when typing', () => {
    const preloadedState = {
      auth: { email: '', password: '', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('should update password input when typing', () => {
    const preloadedState = {
      auth: { email: '', password: '', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  // Test 3: Error handling
  test('should not display errors when errors prop is null', () => {
    const preloadedState = {
      auth: { email: '', password: '', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('should render login form with all required fields', () => {
    const preloadedState = {
      auth: {
        email: '',
        password: '',
        errors: null,
        inProgress: false
      },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    
    // Verify form elements are present
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  // Test 4: Submit button state
  test('should verify button exists when inProgress is true', () => {
    const preloadedState = {
      auth: { email: 'test@test.com', password: 'pass', errors: null, inProgress: true },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeInTheDocument();
  });

  test('should verify button exists when inProgress is false', () => {
    const preloadedState = {
      auth: { email: 'test@test.com', password: 'pass', errors: null, inProgress: false },
      common: { redirectTo: null }
    };
    renderWithProviders(<Login />, { preloadedState });
    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeInTheDocument();
  });
});
