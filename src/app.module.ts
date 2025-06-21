import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteractionModule } from './interaction/interaction.module';
import { MyObjectModule } from './my-object/my-object.module';
import { OnaEnvironmentModule } from './ona-environment/ona-environment.module';

@Module({
  imports: [InteractionModule, MyObjectModule, OnaEnvironmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
