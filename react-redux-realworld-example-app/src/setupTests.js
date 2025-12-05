// CRITICAL: Polyfills MUST be set before any imports
const { TextEncoder, TextDecoder } = require('util');
const { ReadableStream } = require('stream/web');
const { MessageChannel, MessagePort } = require('worker_threads');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;
global.MessageChannel = MessageChannel;
global.MessagePort = MessagePort;

// Now safe to import
import '@testing-library/jest-dom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Suppress console errors and warnings in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
