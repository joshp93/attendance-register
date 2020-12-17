import { ChurchEvent } from './ChurchEvent.model';

describe('Event', () => {
  it('should create an instance', () => {
    expect(new ChurchEvent("123", "asd", new Date())).toBeTruthy();
  });
});
