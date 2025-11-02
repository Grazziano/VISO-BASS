import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, closeTestApp } from './e2e-utils';
import type { MongoMemoryServer } from 'mongodb-memory-server';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mongoServer: MongoMemoryServer | undefined;

  // Increase timeout for CI / slower runners just for this suite
  jest.setTimeout(30000);

  beforeEach(async () => {
    // Use the shared helper so we get an in-memory Mongo URI and proper wiring
    const created = await createTestApp();
    app = created.app;
    mongoServer = created.mongoServer;
  });

  afterEach(async () => {
    if (app) {
      await closeTestApp(app, mongoServer!);
      app = undefined as unknown as INestApplication<App>;
      mongoServer = undefined;
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        // The root route renders an HTML welcome page — assert on a stable fragment
        expect(res.text).toContain('API VISO-BASS');
      });
  });
});
