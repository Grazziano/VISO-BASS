import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteractionModule } from './interaction/interaction.module';
import { OnaEnvironmentModule } from './ona-environment/ona-environment.module';
import { PagerankFriendshipModule } from './pagerank-friendship/pagerank-friendship.module';
import { VisoClassModule } from './viso-class/viso-class.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VisoObjectModule } from './viso-object/viso-object.module';
import { AuthModule } from './auth/auth.module';
import { OwnersModule } from './owners/owners.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carrega os variáveis de ambiente do .env
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 3, // 3 requests por segundo
      },
      {
        name: 'medium',
        ttl: 10000, // 10 segundos
        limit: 20, // 20 requests por 10 segundos
      },
      {
        name: 'long',
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),
    InteractionModule,
    OnaEnvironmentModule,
    PagerankFriendshipModule,
    VisoClassModule,
    VisoObjectModule,
    AuthModule,
    OwnersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
