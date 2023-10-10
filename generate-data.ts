import { JSONSchema } from "./generate-data.types";
import {
  DefaultValues,
  ALPHANUMERIC_CHARACTERS,
} from "./generate-data.constants";

export function generateDataFromSchema(schema: JSONSchema): any {
  let result;

  if (isValidSchemaType(schema.type)) {
    switch (schema.type) {
      case "integer":
        result = Math.floor(generateRandomNumber(schema.exclusiveMinimum));
        break;
      case "number":
        result = generateRandomNumber(schema.exclusiveMinimum);
        break;
      case "string":
        result = generateRandomString();
        break;
      case "array":
        const length = generateRandomNumber(schema.minItems);
        const resultArray: any[] = [];
        for (let i = 0; i < length; i++) {
          const itemData = generateDataFromSchema(schema.items);
          resultArray.push(itemData);
        }
        result = resultArray;
        break;
      case "object":
        let resultObject: Record<string, any> = {};
        if (schema.required) {
          for (const propertyName of schema.required) {
            const propertySchema = schema.properties[propertyName];
            if (!propertySchema) {
              throw new Error(
                `Property schema not found for required property: ${propertyName}`
              );
            }
            resultObject[propertyName] = generateDataFromSchema(propertySchema);
          }
          result = resultObject;
        }
        break;
      default:
        throw new Error(`Unsupported schema type: ${schema.type}`);
    }
  } else {
    throw new Error(`Unsupported schema type: ${schema.type}`);
  }

  return result;
}

export function generateRandomNumber(
  minimum: number = DefaultValues.MIN_NUMBER,
  maximum: number = DefaultValues.MAX_NUMBER
): number {
  return minimum + Math.random() * (maximum - minimum);
}

export function generateRandomString(
  minLength: number = DefaultValues.MIN_STRING_LENGTH,
  maxLength: number = DefaultValues.MAX_STRING_LENGTH
): string {
  if (minLength === 0 || maxLength === 0) {
    return "";
  }

  const length = generateRandomNumber(minLength, maxLength);
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(
      Math.random() * ALPHANUMERIC_CHARACTERS.length
    );
    result += ALPHANUMERIC_CHARACTERS.charAt(randomIndex);
  }
  return result;
}

export function generateRandomArray(itemSchema: JSONSchema): any[] {
  const length = generateRandomNumber(itemSchema.minItems);
  const result: any[] = [];
  for (let i = 0; i < length; i++) {
    const itemData = generateDataFromSchema(itemSchema.items);
    result.push(itemData);
  }
  return result;
}

function isValidSchemaType(type: string): boolean {
  return ["integer", "number", "string", "array", "object"].includes(type);
}
