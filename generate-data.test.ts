import { describe, test, expect } from "@jest/globals";
import {
  generateRandomNumber,
  generateRandomString,
  getCharactersFromSets,
  generateRandomStringByPattern,
  findPropertiesById,
  generateDataFromSchema,
} from "./generate-data";
import {
  DefaultValues,
  CharacterSets,
  schema,
} from "./generate-data.constants";
import { JSONSchema } from "./generate-data.types";

describe("generateRandomObject", () => {
  describe("generateRandomNumber function", () => {
    test("should generate a random number within the default range (0 to 100)", () => {
      const schema: JSONSchema = { type: "number" };
      const result = generateRandomNumber(schema);
      expect(result).toBeGreaterThanOrEqual(DefaultValues.MIN_NUMBER);
      expect(result).toBeLessThanOrEqual(DefaultValues.MAX_NUMBER);
    });

    test("should generate a random number within a specified range (e.g., 10 to 20)", () => {
      const schema: JSONSchema = { type: "number", minimum: 10, maximum: 20 };
      const result = generateRandomNumber(schema);
      expect(result).toBeGreaterThanOrEqual(schema.minimum);
      expect(result).toBeLessThanOrEqual(schema.maximum);
    });

    test("should generate a random integer when minimum and maximum are integers", () => {
      const schema: JSONSchema = { type: "number", minimum: 5, maximum: 15 };
      const result = generateRandomNumber(schema);
      expect(result).toBeGreaterThanOrEqual(schema.minimum);
      expect(result).toBeLessThanOrEqual(schema.maximum);
    });

    test("should generate a random number within the default range (0 to 100) when minimum is not provided", () => {
      const schema: JSONSchema = { type: "number", maximum: 50 };
      const result = generateRandomNumber(schema);
      expect(result).toBeGreaterThanOrEqual(DefaultValues.MIN_NUMBER);
      expect(result).toBeLessThanOrEqual(schema.maximum);
    });

    test("should generate a random number within the default range (0 to 100) when maximum is not provided", () => {
      const schema: JSONSchema = { type: "number", minimum: 10 };
      const result = generateRandomNumber(schema);
      expect(result).toBeGreaterThanOrEqual(schema.minimum);
      expect(result).toBeLessThanOrEqual(DefaultValues.MAX_NUMBER);
    });

    test("should return 0 when maximum is set to 0", () => {
      const schema: JSONSchema = { type: "number", maximum: 0 };
      const result = generateRandomNumber(schema);
      expect(result).toBe(0);
    });
  });

  describe("generateRandomString function", () => {
    test("should generate a random string within the default length range", () => {
      const schema: JSONSchema = { type: "string" };
      const result = generateRandomString(schema);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThanOrEqual(
        DefaultValues.MIN_STRING_LENGTH
      );
      expect(result.length).toBeLessThanOrEqual(
        DefaultValues.MAX_STRING_LENGTH
      );
    });

    test("should generate a random string within the specified length range", () => {
      const schema: JSONSchema = { type: "string", minimum: 5, maximum: 10 };
      const result = generateRandomString(schema);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThanOrEqual(schema.minimum);
      expect(result.length).toBeLessThanOrEqual(schema.maximum);
    });

    test("should generate a string of minimum length when minLength is set to 0", () => {
      const schema: JSONSchema = { type: "string", minimum: 0, maximum: 10 };
      const result = generateRandomString(schema);
      expect(result.length).toBeGreaterThanOrEqual(schema.minimum);
      expect(result.length).toBeLessThanOrEqual(schema.maximum);
    });

    test("should generate an empty string when maxLength is set to 0", () => {
      const schema: JSONSchema = { type: "string", minimum: 1, maximum: 0 };
      const result = generateRandomString(schema);
      expect(result).toBe("");
    });
  });
  describe("getCharactersFromSets function", () => {
    test("should expand [a-z] to lowercase characters", () => {
      const input = `[${CharacterSets.Lowercase}]`;
      const result = getCharactersFromSets(input);
      expect(result).toBe(CharacterSets.LowercaseCharacters);
    });

    test("should expand [A-Z] to uppercase characters", () => {
      const input = `[${CharacterSets.Uppercase}]`;
      const result = getCharactersFromSets(input);
      expect(result).toBe(CharacterSets.UppercaseCharacters);
    });

    test("should expand [0-9] to digit characters", () => {
      const input = `[${CharacterSets.Digits}]`;
      const result = getCharactersFromSets(input);
      expect(result).toBe(CharacterSets.DigitCharacters);
    });

    test("should expand [0-9a-z] to digit and lowercase characters", () => {
      const input = `[${CharacterSets.Digits}${CharacterSets.Lowercase}]`;
      const result = getCharactersFromSets(input);
      const expected =
        CharacterSets.DigitCharacters + CharacterSets.LowercaseCharacters;
      expect(result).toBe(expected);
    });
  });
  describe("generateRandomStringByPattern", () => {
    test("should generate a random string based on the pattern", () => {
      const schema: JSONSchema = { pattern: "This is [a-z]+ pattern [0-9]+" };
      const generatedString = generateRandomStringByPattern(schema);
      const regex = /This is [a-z]+ pattern [0-9]+/;
      expect(generatedString).toMatch(regex);
    });

    test("should handle character sets without a + sign", () => {
      const schema: JSONSchema = { pattern: "Character sets [a-zA-Z0-9]" };
      const generatedString = generateRandomStringByPattern(schema);
      const regex = /Character sets [a-zA-Z0-9]/;
      expect(generatedString).toMatch(regex);
    });

    test("should handle character sets with a + sign", () => {
      const schema: JSONSchema = {
        pattern: "Character sets [a-z]+ and [0-9]+",
      };
      const generatedString = generateRandomStringByPattern(schema);
      const regex = /Character sets [a-z]+ and [0-9]+/;
      expect(generatedString).toMatch(regex);
    });
  });
  describe("findPropertiesById", () => {
    const schema: JSONSchema = {
      definitions: {
        testString: { type: "string", $id: "#testString" },
        testBoolean: { type: "boolean", $id: "#testBoolean" },
      },
    };

    test("should return undefined for undefined schema", () => {
      expect(findPropertiesById("#attendees", undefined)).toBeUndefined();
    });

    test("should find a property by id in the top-level schema", () => {
      const result = findPropertiesById("#testString", schema.definitions);
      expect(result.type).toBe("string");
    });

    test("should find a property by id in a nested schema", () => {
      const result = findPropertiesById("#testBoolean", schema.definitions);
      expect(result.type).toBe("boolean");
    });

    test("should return undefined if property with the given id is not found", () => {
      expect(
        findPropertiesById("nonExistentProp", schema.definitions)
      ).toBeUndefined();
    });
  });
  describe("generateDataFromSchema", () => {
    test("should generate data according to the schema", () => {
      const generatedData = generateDataFromSchema(schema);

      const requiredFields = schema.required || [];
      for (const field of requiredFields) {
        expect(generatedData).toHaveProperty(field);
      }
    });
  });
});
