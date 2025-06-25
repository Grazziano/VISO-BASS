import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MyClassDocument = MyClass & Document;

@Schema()
export class MyClass {
  @Prop({ required: true })
  name: string;

  @Prop()
  role: string;
}

export const MyClassSchema = SchemaFactory.createForClass(MyClass);
