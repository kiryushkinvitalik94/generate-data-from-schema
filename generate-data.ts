import { JSONSchema, JSONSchemaDefinitions } from "./generate-data.types";
import {
  DefaultValues,
  ALPHANUMERIC_CHARACTERS,
  CharacterSets,
} from "./generate-data.constants";

export function generateDataFromSchema(schema: JSONSchema): any {
  if (!schema) {
    throw new Error("Schema is required.");
  }

  const mainSchema = schema;
  const result = iterateObjectBySchema(schema, mainSchema);
  return result;
}

export function iterateObjectBySchema(
  schema: JSONSchema,
  mainSchema: JSONSchema
): any {
  if (schema.$ref) {
    const resolvedSchema = resolveReference(schema.$ref, mainSchema);
    return iterateObjectBySchema(resolvedSchema, mainSchema);
  }

  if (schema.enum) {
    const randomIndex = Math.floor(Math.random() * schema.enum.length);
    return schema.enum[randomIndex];
  }

  if (schema.anyOf) {
    const randomIndex = Math.floor(Math.random() * schema.anyOf.length);
    const selectedSchema = schema.anyOf[randomIndex];
    return iterateObjectBySchema(selectedSchema, mainSchema);
  }

  let result;

  if (isValidSchemaType(schema.type)) {
    switch (schema.type) {
      case "integer":
        result = Math.floor(generateRandomNumber(schema));
        break;
      case "number":
        result = generateRandomNumber(schema);
        break;
      case "string":
        if (schema.pattern) {
          result = generateRandomStringByPattern(schema);
        } else {
          result = generateRandomString(schema);
        }
        break;
      case "array":
        const length = generateRandomNumber(schema);
        const resultArray: any[] = [];
        for (let i = 0; i < length; i++) {
          const itemData = iterateObjectBySchema(schema.items, mainSchema);
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
            resultObject[propertyName] = iterateObjectBySchema(
              propertySchema,
              mainSchema
            );
          }
          result = resultObject;
        }
        break;
      case "null":
        result = null;
        break;
      default:
        throw new Error(`Unsupported schema type: ${schema.type}`);
    }
  } else {
    throw new Error(`Unsupported schema type: ${schema.type}`);
  }

  return result;
}

export function generateRandomNumber(schema: JSONSchema): number {
  const {
    minimum = DefaultValues.MIN_NUMBER,
    maximum = DefaultValues.MAX_NUMBER,
  } = schema;
  if (maximum === 0) {
    return 0;
  }
  return minimum + Math.random() * (maximum - minimum);
}

export function generateRandomString(
  schema: JSONSchema,
  CHARACTERS: string = ALPHANUMERIC_CHARACTERS
): string {
  const {
    minimum = DefaultValues.MIN_STRING_LENGTH,
    maximum = DefaultValues.MAX_STRING_LENGTH,
  } = schema;

  const length = generateRandomNumber({ ...schema, minimum, maximum });
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
    result += CHARACTERS.charAt(randomIndex);
  }
  return result;
}

export function generateRandomStringByPattern(schema: JSONSchema): string {
  const { pattern } = schema;
  let generatedString = "";
  let inCharacterSet = false;
  let currentCharacterSet = "";

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];

    if (inCharacterSet) {
      if (char === "]") {
        const characters = getCharactersFromSets(currentCharacterSet);
        let randomString = "";
        const nextChar = pattern[i + 1];
        if (nextChar === "+") {
          randomString = generateRandomString({}, characters);
          i++;
        } else {
          randomString = generateRandomString({ maximum: 1 }, characters);
        }
        generatedString += randomString;
        inCharacterSet = false;
        currentCharacterSet = "";
      } else {
        currentCharacterSet += char;
      }
    } else {
      if (char === "[") {
        inCharacterSet = true;
      } else {
        generatedString += char;
      }
    }
  }

  return generatedString.replace(/\\/g, "");
}

export function getCharactersFromSets(characterSet: string): string {
  return characterSet
    .replace(/a-z/g, CharacterSets.LowercaseCharacters)
    .replace(/A-Z/g, CharacterSets.UppercaseCharacters)
    .replace(/0-9/g, CharacterSets.DigitCharacters)
    .replace(/^\[|\]$/g, "");
}

function resolveReference(ref: string, schema: JSONSchema): JSONSchema {
  const resolvedSchema = findPropertiesById(ref, schema.definitions);

  if (resolvedSchema) {
    return resolvedSchema;
  } else {
    throw new Error(`Reference not found: ${ref}`);
  }
}

export function findPropertiesById(
  id: string,
  schema: JSONSchemaDefinitions | undefined
): JSONSchema | undefined {
  if (!schema) {
    return undefined;
  }
  for (const key in schema) {
    if (schema[key].$id && schema[key].$id === id) {
      return schema[key];
    }
  }

  return undefined;
}

function isValidSchemaType(type: string): boolean {
  return ["integer", "number", "string", "array", "object", "null"].includes(
    type
  );
}
