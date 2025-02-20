// src/setupTests.ts
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

// Extend vitest's expect with @testing-library/jest-dom's matchers
expect.extend(matchers);

// Mock URL.createObjectURL
const mockCreateObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;

// Clean up after each test
afterEach(() => {
  mockCreateObjectURL.mockReset();
});