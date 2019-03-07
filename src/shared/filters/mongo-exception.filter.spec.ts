import { MongoExceptionFilter } from './mongo-exception.filter';

describe('MongoExceptionFilter', () => {
  it('should be defined', () => {
    expect(new MongoExceptionFilter()).toBeTruthy();
  });
});
