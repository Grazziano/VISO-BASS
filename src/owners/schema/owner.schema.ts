import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type OwnerDocument = Owner & Document;

@Schema({ timestamps: true })
export class Owner {
  toObject(): { [x: string]: any; password: any } {
    throw new Error('Method not implemented.');
  }

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'Rc9e5@example.com',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'user',
  })
  @Prop({ default: 'user' })
  role: string;
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
