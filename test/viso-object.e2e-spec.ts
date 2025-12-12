import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, closeTestApp } from './e2e-utils';
import type { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(30000);

describe('VisoObject (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let createdId: string | undefined;

  beforeAll(async () => {
    const created = await createTestApp({
      userId: 'frodoId',
      email: 'frodo.baggins@shire.middleearth',
    });
    app = created.app;
    mongoServer = created.mongoServer;
    // createTestApp already overrides the AuthGuard when a mock user is provided
  });

  afterAll(async () => {
    await closeTestApp(app, mongoServer);
  });

  it('/object (POST) 201', async () => {
    const payload = {
      obj_networkMAC: '00:1B:44:11:3A:B7',
      obj_name: 'Test Object',
      obj_model: 'ModelX',
      obj_brand: 'BrandY',
      obj_function: ['temperature_sensing'],
      obj_restriction: ['indoor_only'],
      obj_limitation: ['battery_powered'],
      obj_access: 5,
      obj_location: 101,
      obj_qualification: 85,
      obj_status: 1,
    };

    const server = app.getHttpServer() as unknown as App;
    const res = await request(server).post('/object').send(payload).expect(201);
    const body = res.body as { _id: string; obj_name?: string };
    expect(body).toHaveProperty('_id');
    createdId = body._id;
    expect(body.obj_name).toBe('Test Object');
  });

  it('/object (GET) 200', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/object')
      .expect(200);
    const payload = res.body as {
      items: Array<{ _id: string }>;
      total: number;
      page: number;
      limit: number;
    };
    expect(Array.isArray(payload.items)).toBeTruthy();
    expect(payload.items.length).toBeGreaterThanOrEqual(1);
    expect(typeof payload.total).toBe('number');
  });

  it('/object/:id (GET) 200', async () => {
    const id = createdId || '507f1f77bcf86cd799439011';
    const res = await request(app.getHttpServer() as unknown as App)
      .get(`/object/${id}`)
      .expect(200);
    const obj = res.body as { _id: string };
    expect(obj._id).toBe(id);
  });
});
