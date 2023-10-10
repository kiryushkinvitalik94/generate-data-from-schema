import { describe, test, expect } from "@jest/globals";
import {
  generateRandomNumber,
  generateRandomString,
  generateDataFromSchema,
} from "./generate-data";
import { DefaultValues } from "./generate-data.constants";
import { JSONSchema } from "./generate-data.types";
import { schema } from "./generate-data.constants";

describe("generateRandomObject", () => {
  describe("generateRandomNumber function", () => {
    test("should generate a random number within the default range (0 to 100)", () => {
      const result = generateRandomNumber();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    test("should generate a random number within a specified range (e.g., 10 to 20)", () => {
      const minimum = 10;
      const maximum = 20;
      const result = generateRandomNumber(minimum, maximum);
      expect(result).toBeGreaterThanOrEqual(minimum);
      expect(result).toBeLessThanOrEqual(maximum);
    });

    test("should generate a random integer when minimum and maximum are integers", () => {
      const minimum = 5;
      const maximum = 15;
      const result = generateRandomNumber(minimum, maximum);
      expect(result).toBeGreaterThanOrEqual(minimum);
      expect(result).toBeLessThanOrEqual(maximum);
    });

    test("should generate a random number within the default range (0 to 100) when minimum is not provided", () => {
      const result = generateRandomNumber(undefined, 50);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(50);
    });

    test("should generate a random number within the default range (0 to 100) when maximum is not provided", () => {
      const result = generateRandomNumber(10);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  describe("generateRandomString function", () => {
    test("should generate a random string within the default length range", () => {
      const result = generateRandomString();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThanOrEqual(
        DefaultValues.MIN_STRING_LENGTH
      );
      expect(result.length).toBeLessThanOrEqual(
        DefaultValues.MAX_STRING_LENGTH
      );
    });

    test("should generate a random string within the specified length range", () => {
      const minLength = 5;
      const maxLength = 10;
      const result = generateRandomString(minLength, maxLength);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThanOrEqual(minLength);
      expect(result.length).toBeLessThanOrEqual(maxLength);
    });

    test("should generate an empty string when minLength is set to 0", () => {
      const result = generateRandomString(0, 10);
      expect(result).toBe("");
    });

    test("should generate an empty string when maxLength is set to 0", () => {
      const result = generateRandomString(1, 0);
      expect(result).toBe("");
    });
  });
  describe("generateDataFromSchema function", () => {
    test("should generate an object based on the schema", () => {
      const schema: JSONSchema = {
        type: "object",
        properties: {
          age: { type: "integer" },
          name: { type: "string" },
          scores: {
            type: "array",
            items: { type: "number" },
            minItems: 3,
          },
        },
        required: ["name", "age", "scores"],
      };

      const result = generateDataFromSchema(schema);

      console.log(result, "result");

      expect(result).toHaveProperty("name");
      expect(typeof result.name).toBe("string");
      expect(result).toHaveProperty("age");
      expect(Number.isInteger(result.age)).toBe(true);
      expect(result).toHaveProperty("scores");
      expect(Array.isArray(result.scores)).toBe(true);
      expect(result.scores.length).toBeGreaterThanOrEqual(3);
      result.scores.forEach((score: number) => {
        expect(typeof score).toBe("number");
      });
    });

    test("should throw an error for an unsupported schema type", () => {
      const schema: JSONSchema = {
        type: "unsupportedType",
      };

      expect(() => generateDataFromSchema(schema)).toThrow(
        "Unsupported schema type: unsupportedType"
      );
    });

    test("should throw an error if a required property's schema is missing", () => {
      const schema: JSONSchema = {
        type: "object",
        properties: {
          age: { type: "integer" },
        },
        required: ["name"],
      };

      expect(() => generateDataFromSchema(schema)).toThrow(
        "Property schema not found for required property: name"
      );
    });

    test("should generate an object based on the schema", () => {
      const result = generateDataFromSchema(schema);

      expect(result).toHaveProperty("productId");
      expect(Number.isInteger(result.productId)).toBe(true);

      expect(result).toHaveProperty("productName");
      expect(typeof result.productName).toBe("string");

      expect(result).toHaveProperty("price");
      expect(typeof result.price).toBe("number");
      expect(result.price).toBeGreaterThanOrEqual(0);

      expect(result).toHaveProperty("tags");
      expect(Array.isArray(result.tags)).toBe(true);
      expect(result.tags.length).toBeGreaterThanOrEqual(1);
      expect(new Set(result.tags).size).toBe(result.tags.length);

      expect(result).toHaveProperty("dimensions");
      expect(typeof result.dimensions).toBe("object");
      expect(result.dimensions).toHaveProperty("length");
      expect(result.dimensions).toHaveProperty("width");
      expect(result.dimensions).toHaveProperty("height");
      expect(typeof result.dimensions.length).toBe("number");
      expect(typeof result.dimensions.width).toBe("number");
      expect(typeof result.dimensions.height).toBe("number");
    });
  });
});
