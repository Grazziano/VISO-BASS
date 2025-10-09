import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VisoObject } from '../../viso-object/schema/viso-object.schema';

@Schema({ timestamps: true })
export class OnaEnvironment extends Document {
  @Prop({ required: true })
  env_object_i: string;

  @Prop({ required: true, default: 0 })
  env_total_interactions: number;

  @Prop({ required: true, default: 0 })
  env_total_valid: number;

  @Prop({ required: true, default: 0 })
  env_total_new: number;

  @Prop({ type: [[Number]], default: [] })
  env_adjacency: number[];

  @Prop({ type: [Types.ObjectId], ref: VisoObject.name })
  objects: Types.ObjectId[];
}

export const OnaEnvironmentSchema =
  SchemaFactory.createForClass(OnaEnvironment);
