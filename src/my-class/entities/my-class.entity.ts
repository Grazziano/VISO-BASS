import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<MyClass>;

@Schema({ timestamps: true })
export class MyClass {
  @Prop({ type: Number, required: true, unique: true })
  id: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  role: string; // Renomeado para evitar uso de palavra reservada
}

export const MyClassSchema = SchemaFactory.createForClass(MyClass);
