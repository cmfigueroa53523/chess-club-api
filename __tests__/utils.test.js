import {toSnakeCase} from '../src/utils/utils.js';

describe('toSnakeCase function', () => {

  test('should return string in snake case', () => {
    const result = toSnakeCase('firstName');
    expect(result).toBe('first_name');
  });

  test('should return empty string', () => {
    const result = toSnakeCase('');
    expect(result).toBe('');
  });

  test('should throw an error for number input', () => {
    expect(() => {
      toSnakeCase(100);
    }).toThrow('str must be a string. Recieved: number');
  });

  test('should throw an error for object input', () => {
    expect(() => {
      toSnakeCase([1, 2, 3]);
    }).toThrow('str must be a string. Recieved: object');
  });

});
