import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import Login from './Login';
import ListErrors from './ListErrors';

// Get the unwrapped component for testing
const LoginComponent = Login.WrappedComponent || Login;

describe('Login Component', () => {
  const mockProps = {
    email: '',
    password: '',
    errors: null,
    inProgress: false,
    onChangeEmail: jest.fn(),
    onChangePassword: jest.fn(),
    onSubmit: jest.fn(),
    onUnload: jest.fn()
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Form rendering
  it('should render the login form', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    expect(wrapper.find('form')).toHaveLength(1);
  });

  it('should render email input field', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const emailInput = wrapper.find('input[type="email"]');
    expect(emailInput).toHaveLength(1);
    expect(emailInput.prop('placeholder')).toBe('Email');
  });

  it('should render password input field', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const passwordInput = wrapper.find('input[type="password"]');
    expect(passwordInput).toHaveLength(1);
    expect(passwordInput.prop('placeholder')).toBe('Password');
  });

  it('should render submit button', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton).toHaveLength(1);
    expect(submitButton.text()).toContain('Sign in');
  });

  it('should render link to register page', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const registerLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/register');
    expect(registerLink).toHaveLength(1);
    expect(registerLink.children().text()).toBe('Need an account?');
  });

  it('should render "Sign In" heading', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const heading = wrapper.find('h1');
    expect(heading.text()).toBe('Sign In');
  });

  // Test 2: Input field updates
  it('should call onChangeEmail when email input changes', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const emailInput = wrapper.find('input[type="email"]');
    
    emailInput.simulate('change', { target: { value: 'test@example.com' } });
    
    expect(mockProps.onChangeEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should call onChangePassword when password input changes', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const passwordInput = wrapper.find('input[type="password"]');
    
    passwordInput.simulate('change', { target: { value: 'password123' } });
    
    expect(mockProps.onChangePassword).toHaveBeenCalledWith('password123');
  });

  it('should display email value from props', () => {
    const propsWithEmail = { ...mockProps, email: 'test@example.com' };
    const wrapper = shallow(<LoginComponent {...propsWithEmail} />);
    const emailInput = wrapper.find('input[type="email"]');
    
    expect(emailInput.prop('value')).toBe('test@example.com');
  });

  it('should display password value from props', () => {
    const propsWithPassword = { ...mockProps, password: 'mypassword' };
    const wrapper = shallow(<LoginComponent {...propsWithPassword} />);
    const passwordInput = wrapper.find('input[type="password"]');
    
    expect(passwordInput.prop('value')).toBe('mypassword');
  });

  // Test 3: Form submission
  it('should call onSubmit when form is submitted', () => {
    const propsWithData = {
      ...mockProps,
      email: 'user@example.com',
      password: 'password123'
    };
    const wrapper = shallow(<LoginComponent {...propsWithData} />);
    const form = wrapper.find('form');
    
    form.simulate('submit', { preventDefault: () => {} });
    
    expect(mockProps.onSubmit).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  it('should prevent default form submission', () => {
    const preventDefault = jest.fn();
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const form = wrapper.find('form');
    
    form.simulate('submit', { preventDefault });
    
    expect(preventDefault).toHaveBeenCalled();
  });

  // Test 4: Error message display
  it('should render ListErrors component', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    expect(wrapper.find(ListErrors)).toHaveLength(1);
  });

  it('should pass errors prop to ListErrors', () => {
    const mockErrors = {
      'email or password': ['is invalid']
    };
    const propsWithErrors = { ...mockProps, errors: mockErrors };
    const wrapper = shallow(<LoginComponent {...propsWithErrors} />);
    const listErrors = wrapper.find(ListErrors);
    
    expect(listErrors.prop('errors')).toBe(mockErrors);
  });

  it('should not show errors when errors prop is null', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const listErrors = wrapper.find(ListErrors);
    
    expect(listErrors.prop('errors')).toBeNull();
  });

  // Test 5: Component lifecycle
  it('should call onUnload on componentWillUnmount', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    wrapper.unmount();
    
    expect(mockProps.onUnload).toHaveBeenCalled();
  });

  // Test 6: Disabled state during submission
  it('should disable submit button when inProgress is true', () => {
    const propsInProgress = { ...mockProps, inProgress: true };
    const wrapper = shallow(<LoginComponent {...propsInProgress} />);
    const submitButton = wrapper.find('button[type="submit"]');
    
    expect(submitButton.prop('disabled')).toBe(true);
  });

  it('should enable submit button when inProgress is false', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const submitButton = wrapper.find('button[type="submit"]');
    
    expect(submitButton.prop('disabled')).toBe(false);
  });

  // Test 7: Empty form submission
  it('should allow form submission even with empty fields', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const form = wrapper.find('form');
    
    form.simulate('submit', { preventDefault: () => {} });
    
    expect(mockProps.onSubmit).toHaveBeenCalledWith('', '');
  });

  // Test 8: CSS classes
  it('should have correct CSS classes on form elements', () => {
    const wrapper = shallow(<LoginComponent {...mockProps} />);
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');
    
    expect(emailInput.hasClass('form-control')).toBe(true);
    expect(emailInput.hasClass('form-control-lg')).toBe(true);
    expect(passwordInput.hasClass('form-control')).toBe(true);
    expect(passwordInput.hasClass('form-control-lg')).toBe(true);
  });
});
