import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MyClassDocument = MyClass & Document;

@Schema({ timestamps: true })
export class MyClass {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: string;
}

export const MyClassSchema = SchemaFactory.createForClass(MyClass);
