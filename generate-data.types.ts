export type JSONSchema = {
  type?: JSONSchemaType;
  $ref?: string;
  anyOf?: JSONSchema[];
  minimum?: number;
  items?: JSONSchema;
  maximum?: number;
  pattern?: string;
  minItems?: number;
  maxItems?: number;
  definitions?: JSONSchemaDefinitions;
  properties?: JSONSchemaProperties;
  required?: string[];
  enum?: string[];
  default?: string[];
};

type JSONSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"
  | "null";

export type JSONSchemaDefinitions = Record<
  string,
  JSONSchema & { $id: string }
>;
export type JSONSchemaProperties = Record<string, JSONSchema>;
