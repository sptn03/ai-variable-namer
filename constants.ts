
import { NamingConvention } from './types';

export const NAMING_CONVENTION_LABELS: Record<NamingConvention, string> = {
  [NamingConvention.CAMEL_CASE]: "camelCase",
  [NamingConvention.PASCAL_CASE]: "PascalCase",
  [NamingConvention.SNAKE_CASE]: "snake_case",
  [NamingConvention.SCREAMING_SNAKE_CASE]: "SCREAMING_SNAKE_CASE",
};

export const CONVENTION_ORDER: NamingConvention[] = [
  NamingConvention.CAMEL_CASE,
  NamingConvention.PASCAL_CASE,
  NamingConvention.SNAKE_CASE,
  NamingConvention.SCREAMING_SNAKE_CASE,
];

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
