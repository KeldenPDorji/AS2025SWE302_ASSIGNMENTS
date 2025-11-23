import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import Header from './Header';

describe('Header Component', () => {
  const mockAppName = 'conduit';

  // Test 1: Navigation links for guest user (logged out)
  it('should render Home link for guest users', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    const homeLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/' && n.children().text() === 'Home');
    expect(homeLink).toHaveLength(1);
  });

  it('should render Sign in link for guest users', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    const signInLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/login');
    expect(signInLink).toHaveLength(1);
    expect(signInLink.children().text()).toContain('Sign in');
  });

  it('should render Sign up link for guest users', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    const signUpLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/register');
    expect(signUpLink).toHaveLength(1);
    expect(signUpLink.children().text()).toContain('Sign up');
  });

  it('should NOT render New Post link for guest users', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    const newPostLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/editor');
    expect(newPostLink).toHaveLength(0);
  });

  it('should NOT render Settings link for guest users', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    const settingsLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/settings');
    expect(settingsLink).toHaveLength(0);
  });

  // Test 2: Navigation links for logged-in user
  it('should render Home link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const homeLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/' && n.children().text() === 'Home');
    expect(homeLink).toHaveLength(1);
  });

  it('should render New Post link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const newPostLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/editor');
    expect(newPostLink).toHaveLength(1);
  });

  it('should render Settings link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const settingsLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/settings');
    expect(settingsLink).toHaveLength(1);
  });

  it('should render profile link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const profileLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/@testuser');
    expect(profileLink).toHaveLength(1);
  });

  it('should NOT render Sign in link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const signInLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/login');
    expect(signInLink).toHaveLength(0);
  });

  it('should NOT render Sign up link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const signUpLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/register');
    expect(signUpLink).toHaveLength(0);
  });

  // Test 3: App name/brand display
  it('should render app name as brand', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    const brandLink = wrapper.find('.navbar-brand');
    expect(brandLink.children().text()).toBe('conduit');
  });

  it('should convert app name to lowercase', () => {
    const wrapper = shallow(<Header appName="CONDUIT" currentUser={null} />);
    const brandLink = wrapper.find('.navbar-brand');
    expect(brandLink.children().text()).toBe('conduit');
  });

  it('should link brand to home page', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    const brandLink = wrapper.find('.navbar-brand');
    expect(brandLink.prop('to')).toBe('/');
  });

  // Test 4: User profile image and username
  it('should display user profile image for logged-in users', () => {
    const mockUser = { 
      username: 'testuser', 
      email: 'test@example.com', 
      token: 'jwt-token',
      image: 'https://example.com/avatar.jpg'
    };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const userImage = wrapper.find('.user-pic');
    expect(userImage.prop('src')).toBe('https://example.com/avatar.jpg');
  });

  it('should display default image when user has no image', () => {
    const mockUser = { 
      username: 'testuser', 
      email: 'test@example.com', 
      token: 'jwt-token'
    };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const userImage = wrapper.find('.user-pic');
    expect(userImage.prop('src')).toBe('https://static.productionready.io/images/smiley-cyrus.jpg');
  });

  it('should display username in profile link for logged-in users', () => {
    const mockUser = { 
      username: 'johndoe', 
      email: 'john@example.com', 
      token: 'jwt-token'
    };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const profileLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/@johndoe');
    expect(profileLink.children().text()).toContain('johndoe');
  });

  // Test 5: Navigation structure
  it('should render nav element with correct class', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    expect(wrapper.find('nav.navbar')).toHaveLength(1);
  });

  it('should render navigation list', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    expect(wrapper.find('ul.nav.navbar-nav')).toHaveLength(1);
  });

  it('should render all navigation items in list items', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    const navItems = wrapper.find('li.nav-item');
    expect(navItems.length).toBeGreaterThan(0);
  });

  // Test 6: Icons in navigation
  it('should render compose icon for New Post link', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const newPostLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/editor');
    expect(newPostLink.find('i.ion-compose')).toHaveLength(1);
  });

  it('should render settings icon for Settings link', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    const settingsLink = wrapper.find(Link).findWhere(n => n.prop('to') === '/settings');
    expect(settingsLink.find('i.ion-gear-a')).toHaveLength(1);
  });

  // Test 7: Conditional rendering based on auth state
  it('should only render logged out view when no user', () => {
    const wrapper = shallow(<Header appName={mockAppName} currentUser={null} />);
    // Guest user should see 3 links: Home, Sign in, Sign up
    const guestLinks = wrapper.find(Link).filterWhere(n => 
      n.prop('to') === '/' || 
      n.prop('to') === '/login' || 
      n.prop('to') === '/register'
    );
    expect(guestLinks.length).toBeGreaterThanOrEqual(3);
  });

  it('should only render logged in view when user exists', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    const wrapper = shallow(<Header appName={mockAppName} currentUser={mockUser} />);
    // Logged in user should see: Home, New Post, Settings, Profile
    const userLinks = wrapper.find(Link).filterWhere(n => 
      n.prop('to') === '/' || 
      n.prop('to') === '/editor' || 
      n.prop('to') === '/settings' ||
      n.prop('to') === '/@testuser'
    );
    expect(userLinks.length).toBeGreaterThanOrEqual(4);
  });
});
