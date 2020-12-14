import { ChurchEvent } from './event';

describe('Event', () => {
  it('should create an instance', () => {
    expect(new ChurchEvent("123", "asd", new Date())).toBeTruthy();
  });
});
