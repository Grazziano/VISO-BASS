import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, closeTestApp } from './e2e-utils';

describe('OnaEnvironment (e2e)', () => {
  let app: INestApplication;
  let mongoServer: import('mongodb-memory-server').MongoMemoryServer;
  let objectId: string | undefined;
  let envId: string | undefined;

  beforeAll(async () => {
    const created = await createTestApp({
      userId: 'aragornId',
      email: 'aragorn@arnor.gondor',
    });
    app = created.app;
    mongoServer = created.mongoServer;

    // create an object to reference
    const payload = {
      obj_networkMAC: '00:1B:44:11:3A:C1',
      obj_name: 'Ona Env Obj',
      obj_model: 'ModelO',
      obj_brand: 'BrandO',
      obj_function: ['temperature_sensing'],
      obj_restriction: ['indoor_only'],
      obj_limitation: ['battery_powered'],
      obj_access: 5,
      obj_location: 1,
      obj_qualification: 80,
      obj_status: 1,
    };

    const res = await request(app.getHttpServer() as unknown as App)
      .post('/object')
      .send(payload)
      .expect(201);
    objectId = res.body._id;
  });

  afterAll(async () => {
    await closeTestApp(app, mongoServer);
  });

  it('/ona-environment (POST) 201', async () => {
    const payload = {
      env_object_i: objectId,
      env_total_interactions: 10,
      env_total_valid: 8,
      env_total_new: 2,
      env_adjacency: [
        [0, 1],
        [1, 0],
      ],
      objects: [objectId],
    };

    const res = await request(app.getHttpServer() as unknown as App)
      .post('/ona-environment')
      .send(payload)
      .expect(201);
    const body = res.body as { _id: string };
    envId = body._id;
    expect(envId).toBeDefined();
  });

  it('/ona-environment (GET) 200', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/ona-environment')
      .expect(200);
    const list = res.body as Array<{ _id: string }>;
    expect(Array.isArray(list)).toBeTruthy();
  });

  it('/ona-environment/:id (GET) 200', async () => {
    const id = envId as string;
    const res = await request(app.getHttpServer() as unknown as App)
      .get(`/ona-environment/${id}`)
      .expect(200);
    const obj = res.body as { _id: string };
    expect(obj._id).toBe(id);
  });
});
