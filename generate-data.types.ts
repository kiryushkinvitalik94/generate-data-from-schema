export type JSONSchema = {
  type: string;
  properties?: JSONSchemaProperties;
  items?: JSONSchema;
  exclusiveMinimum?: number;
  minItems?: number;
  uniqueItems?: boolean;
  required?: string[];
};

export type JSONSchemaProperties = Record<string, JSONSchema>;
