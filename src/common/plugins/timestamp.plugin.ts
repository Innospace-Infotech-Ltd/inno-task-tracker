import { Schema } from 'mongoose';

export function TimestampPlugin(schema: Schema) {
  schema.set('timestamps', true);
}
