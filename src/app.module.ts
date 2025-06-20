import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteractionModule } from './interaction/interaction.module';
import { ObjectModule } from './object/object.module';

@Module({
  imports: [InteractionModule, ObjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
