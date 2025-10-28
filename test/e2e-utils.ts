import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

type MockUser = { userId: string; email: string };

interface TestRequest extends Request {
  user?: MockUser;
}

export async function createTestApp(
  mockUser?: MockUser,
): Promise<{ app: INestApplication; mongoServer: MongoMemoryServer }> {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Ensure the AppModule picks up the in-memory URI
  process.env.MONGO_URI = uri;

  const moduleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (mockUser) {
    moduleBuilder.overrideGuard(AuthGuard('jwt')).useValue({
      canActivate: (context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest<TestRequest>();
        req.user = mockUser;
        return true;
      },
    });
  }

  const moduleRef = await moduleBuilder.compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return { app, mongoServer };
}

export async function closeTestApp(
  app: INestApplication,
  mongoServer: MongoMemoryServer,
) {
  await app.close();
  try {
    await mongoServer.stop();
  } catch {
    // ignore errors during shutdown
  }
}
