import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Header from './Header';

describe('Header Component', () => {
  const mockAppName = 'conduit';

  // Test 1: Navigation links for guest user (logged out)
  test('should render Home link for guest users', () => {
    renderWithProviders(<Header appName={mockAppName} currentUser={null} />);
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  test('should render Sign in link for guest users', () => {
    renderWithProviders(<Header appName={mockAppName} currentUser={null} />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('should render Sign up link for guest users', () => {
    renderWithProviders(<Header appName={mockAppName} currentUser={null} />);
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  test('should NOT render New Post link for guest users', () => {
    renderWithProviders(<Header appName={mockAppName} currentUser={null} />);
    expect(screen.queryByText(/New Post/i)).not.toBeInTheDocument();
  });

  test('should NOT render Settings link for guest users', () => {
    renderWithProviders(<Header appName={mockAppName} currentUser={null} />);
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  // Test 2: Navigation links for logged-in user
  test('should render Home link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    renderWithProviders(<Header appName={mockAppName} currentUser={mockUser} />);
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  test('should render New Post link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    renderWithProviders(<Header appName={mockAppName} currentUser={mockUser} />);
    expect(screen.getByText(/New Post/i)).toBeInTheDocument();
  });

  test('should render Settings link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    renderWithProviders(<Header appName={mockAppName} currentUser={mockUser} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('should render profile link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    renderWithProviders(<Header appName={mockAppName} currentUser={mockUser} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  test('should NOT render Sign in link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    renderWithProviders(<Header appName={mockAppName} currentUser={mockUser} />);
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
  });

  test('should NOT render Sign up link for logged-in users', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', token: 'jwt-token' };
    renderWithProviders(<Header appName={mockAppName} currentUser={mockUser} />);
    expect(screen.queryByText('Sign up')).not.toBeInTheDocument();
  });

  // Test 3: App name/brand display
  test('should render app name as brand', () => {
    renderWithProviders(<Header appName={mockAppName} currentUser={null} />);
    expect(screen.getByText('conduit')).toBeInTheDocument();
  });

  test('should convert app name to lowercase', () => {
    renderWithProviders(<Header appName="CONDUIT" currentUser={null} />);
    const elements = screen.getAllByText('conduit');
    expect(elements.length).toBeGreaterThan(0);
  });
});
