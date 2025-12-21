import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Interaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'VisoObject' })
  inter_obj_i: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'VisoObject' })
  inter_obj_j: Types.ObjectId;

  @Prop()
  inter_start: Date;

  @Prop()
  inter_end: Date;

  @Prop()
  inter_feedback: boolean;

  @Prop()
  inter_service: number;
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);
