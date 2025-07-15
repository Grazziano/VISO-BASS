import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class OnaEnvironment extends Document {
  @Prop({ required: true })
  env_object_i: string;

  @Prop({ required: true, default: 0 })
  env_total_Intera: number;

  @Prop({ required: true, default: 0 })
  env_total_valida: number;

  @Prop({ required: true, default: 0 })
  env_total_new: number;

  @Prop({ type: [[Number]], default: [] })
  env_adjacency: number[][];
}

export const OnaEnvironmentSchema =
  SchemaFactory.createForClass(OnaEnvironment);
