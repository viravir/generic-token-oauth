import { expect } from 'chai';

import { InvalidOptionsError } from '../errors';

describe('Errors', () => {
  describe('InvalidOptionsError', () => {
    it('Should be defined', () => {
      expect(InvalidOptionsError).not.to.be.undefined;
      expect(typeof InvalidOptionsError).to.equal('function');
    });

    it('Should have Error as a prototype', () => {
      const expectedResult = true;

      expect(InvalidOptionsError.prototype instanceof Error).to.equal(expectedResult);
    });

    it('Should initialize properly', () => {
      const errorMsg = 'Invalid Options!';
      const invalidOptionsError = new InvalidOptionsError(errorMsg);

      expect(invalidOptionsError.name).to.equal('InvalidOptionsError');
      expect(invalidOptionsError.message).to.equal(errorMsg);
    });
  });
});
