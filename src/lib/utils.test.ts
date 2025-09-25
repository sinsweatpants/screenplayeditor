import data from './placeholder-images.json';
import { describe, it, expect } from 'vitest';

describe('JSON import', () => {
  it('loads placeholder-images.json as array/object', () => {
    expect(data).toBeTruthy();
  });
});
