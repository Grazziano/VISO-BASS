import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { OnaEnvironment } from 'src/ona-environment/schema/ona-enviroment.schema';
// import { VisoClass } from 'src/viso-class/schemas/viso-class.schema';
// import { VisoObject } from 'src/viso-object/schema/viso-object.schema';

@Schema({ timestamps: true })
export class Interaction extends Document {
  // @Prop({ type: Types.ObjectId, ref: VisoObject.name, required: true })
  // objeto: Types.ObjectId;

  // @Prop({ type: Types.ObjectId, ref: VisoClass.name, required: true })
  // class: Types.ObjectId;

  // @Prop({ type: Types.ObjectId, ref: OnaEnvironment.name, required: true })
  // ambiente: Types.ObjectId;

  // @Prop()
  // tipo: string;

  // @Prop()
  // descricao: string;

  // @Prop()
  // data: Date;

  @Prop()
  inter_obj_i: number;

  @Prop()
  inter_obj_j: number;

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
