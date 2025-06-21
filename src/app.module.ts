import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteractionModule } from './interaction/interaction.module';
import { MyObjectModule } from './my-object/my-object.module';

@Module({
  imports: [InteractionModule, MyObjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
