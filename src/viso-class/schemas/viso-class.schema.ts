import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VisoObject } from '../../viso-object/schema/viso-object.schema';

export type VisoClassDocument = VisoClass & Document;

@Schema({ timestamps: true })
export class VisoClass {
  @Prop({ required: true })
  class_name: string;

  @Prop({ required: true })
  class_function: string[];

  @Prop({ type: [Types.ObjectId], ref: VisoObject.name })
  objects: Types.ObjectId[];
}

export const VisoClassSchema = SchemaFactory.createForClass(VisoClass);
