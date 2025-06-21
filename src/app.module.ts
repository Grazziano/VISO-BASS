import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteractionModule } from './interaction/interaction.module';
import { MyObjectModule } from './my-object/my-object.module';
import { OnaEnvironmentModule } from './ona-environment/ona-environment.module';
import { PagerankFriendshipModule } from './pagerank-friendship/pagerank-friendship.module';

@Module({
  imports: [
    InteractionModule,
    MyObjectModule,
    OnaEnvironmentModule,
    PagerankFriendshipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
