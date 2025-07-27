import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PageRankFriendshipDocument = PageRankFriendship & Document;

@Schema({ timestamps: true })
export class PageRankFriendship {
  @Prop({ required: true })
  rank_object: string;

  @Prop({ required: true })
  rank_adjacency: string[];
}

export const PageRankFriendshipSchema =
  SchemaFactory.createForClass(PageRankFriendship);
