import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VisoClassDocument = VisoClass & Document;

@Schema({ timestamps: true })
export class VisoClass {
  @Prop({ required: true })
  class_name: string;

  @Prop({ required: true })
  class_function: string[];
}

export const VisoClassSchema = SchemaFactory.createForClass(VisoClass);
