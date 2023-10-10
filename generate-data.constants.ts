import { JSONSchema } from "./generate-data.types";

export enum DefaultValues {
  MIN_STRING_LENGTH = 1,
  MIN_NUMBER = 0,
  MAX_NUMBER = 100,
  MAX_STRING_LENGTH = 10,
}

export const ALPHANUMERIC_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const schema: JSONSchema = {
  type: "object",
  properties: {
    productId: {
      type: "integer",
    },
    productName: {
      type: "string",
    },
    price: {
      type: "number",
      exclusiveMinimum: 0,
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
      uniqueItems: true,
    },
    dimensions: {
      type: "object",
      properties: {
        length: {
          type: "number",
        },
        width: {
          type: "number",
        },
        height: {
          type: "number",
        },
      },
      required: ["length", "width", "height"],
    },
  },
  required: ["productId", "productName", "price", "tags", "dimensions"],
};
