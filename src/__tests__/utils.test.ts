import { expect } from 'chai';

import { parseJSONObject } from '../utils';

describe('Utils', () => {
  describe('parseJSONObject()', () => {
    it('should be defined', () => {
      expect(parseJSONObject).not.to.be.undefined;
      expect(typeof parseJSONObject).to.equal('function');
    });

    it('should return false it argument is not a valid json object string', () => {
      const notValidJsonObject = '123';
      const expectedResult = false;

      const actualResult = parseJSONObject(notValidJsonObject);

      expect(actualResult).to.equal(expectedResult);
    });

    it('should return parsed object if argument is a valid json object string', () => {
      const validJsonObject = '{"name":"Peter","age":"30"}';
      const expectedResult = { name: 'Peter', age: '30' };

      const actualResult = parseJSONObject(validJsonObject);

      expect(actualResult).not.to.equal(false);

      if (actualResult) {
        Object.entries(expectedResult).forEach(([key, value]) => expect(actualResult[key]).to.equal(value));
      }
    });
  });
});
