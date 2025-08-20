import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UsersModule } from 'src/users/users.module';

export type VisoObjectDocument = VisoObject & Document;

@Schema({ timestamps: true })
export class VisoObject {
  @Prop({
    required: true,
    validate: (value: string) =>
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value),
    index: true,
  })
  obj_networkMAC: string;

  @Prop({ required: true })
  obj_name: string;

  @Prop({ type: Types.ObjectId, ref: UsersModule.name })
  obj_owner: Types.ObjectId;

  @Prop({ required: true })
  obj_model: string;

  @Prop({ required: true })
  obj_brand: string;

  @Prop({ required: true, type: [String] })
  obj_function: string[];

  @Prop({ required: true, type: [String] })
  obj_restriction: string[];

  @Prop({ required: true, type: [String] })
  obj_limitation: string[];

  @Prop({ required: true, default: 0 })
  obj_access: number;

  @Prop({ required: true })
  obj_location: number;

  @Prop({ required: true })
  obj_qualification: number;

  @Prop({ required: true, default: 1 })
  obj_status: number;

  @Prop({ type: Types.ObjectId, ref: 'Class' })
  class: Types.ObjectId;
}

export const VisoObjectSchema = SchemaFactory.createForClass(VisoObject);
