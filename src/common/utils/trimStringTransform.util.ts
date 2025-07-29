import { TransformFnParams } from 'class-transformer';

export function trimString({ value }: TransformFnParams): typeof value {
  return typeof value === 'string' ? value.trim() : value;
}
