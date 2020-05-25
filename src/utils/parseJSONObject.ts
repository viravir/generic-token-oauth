import { JsonObject } from '../types/common';

function parseJSONObject(jsonString: string): JsonObject | false {
  try {
    const parsedValue = JSON.parse(jsonString);

    if (parsedValue && typeof parsedValue === 'object') {
      return parsedValue;
    }
  } catch (_) {
    // Argument is not a valid json string. Do nothing.
  }

  return false;
}

export default parseJSONObject;
