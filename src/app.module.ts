import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteractionModule } from './interaction/interaction.module';

@Module({
  imports: [InteractionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
