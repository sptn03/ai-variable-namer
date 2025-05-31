
export enum NamingConvention {
  CAMEL_CASE = 'camelCase',
  PASCAL_CASE = 'pascalCase',
  SNAKE_CASE = 'snakeCase',
  SCREAMING_SNAKE_CASE = 'screamingSnakeCase',
}

export interface SuggestedName {
  baseName: string;
  [NamingConvention.CAMEL_CASE]: string;
  [NamingConvention.PASCAL_CASE]: string;
  [NamingConvention.SNAKE_CASE]: string;
  [NamingConvention.SCREAMING_SNAKE_CASE]: string;
}
