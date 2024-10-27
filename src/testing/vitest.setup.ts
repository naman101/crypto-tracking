import '@testing-library/jest-dom/vitest';
import { server } from './mocks/handlers';

const localStorageMock: Storage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    key: (): string | null => '',
    length: Object.keys(store).length,
  };
})();

let originalLocalStorage: Storage;

beforeAll(() => {
  server.listen();
  // Mock the ResizeObserver
  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Stub the global ResizeObserver
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  originalLocalStorage = window.localStorage;
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  Object.defineProperty(window, 'localStorage', {
    value: originalLocalStorage,
  });
  vi.unstubAllGlobals();
});
