import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Interaction, InteractionSchema } from './schema/interaction.schema';
import { VisoObjectModule } from 'src/viso-object/viso-object.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interaction.name, schema: InteractionSchema },
    ]),
    VisoObjectModule,
  ],
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
