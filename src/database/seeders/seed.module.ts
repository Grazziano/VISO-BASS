import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { ConfigModule } from '@nestjs/config';
import { Owner, OwnerSchema } from 'src/owners/schema/owner.schema';
import {
  VisoObject,
  VisoObjectSchema,
} from 'src/viso-object/schema/viso-object.schema';
import {
  VisoClass,
  VisoClassSchema,
} from 'src/viso-class/schemas/viso-class.schema';
import {
  PageRankFriendship,
  PageRankFriendshipSchema,
} from 'src/pagerank-friendship/schema/pagerank-friendship.schema';
import {
  OnaEnvironment,
  OnaEnvironmentSchema,
} from 'src/ona-environment/schema/ona-enviroment.schema';
import {
  Interaction,
  InteractionSchema,
} from 'src/interaction/schema/interaction.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([
      { name: Owner.name, schema: OwnerSchema },
      { name: VisoObject.name, schema: VisoObjectSchema },
      { name: VisoClass.name, schema: VisoClassSchema },
      { name: PageRankFriendship.name, schema: PageRankFriendshipSchema },
      { name: OnaEnvironment.name, schema: OnaEnvironmentSchema },
      { name: Interaction.name, schema: InteractionSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
