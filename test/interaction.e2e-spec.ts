import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, closeTestApp } from './e2e-utils';

// Increase default jest timeout for e2e (starting in-memory Mongo + Nest app can be slow)
jest.setTimeout(30000);

describe('Interaction (e2e)', () => {
  let app: INestApplication;
  let mongoServer: import('mongodb-memory-server').MongoMemoryServer;
  let objAId: string | undefined;
  let objBId: string | undefined;
  let interactionId: string | undefined;

  beforeAll(async () => {
    const created = await createTestApp({
      userId: 'sauronId',
      email: 'sauron@baraddur.mordor',
    });
    app = created.app;
    mongoServer = created.mongoServer;

    // create two objects to reference in interactions
    const payload = {
      obj_networkMAC: '00:1B:44:11:3A:B1',
      obj_name: 'Interaction Obj A',
      obj_model: 'ModelA',
      obj_brand: 'BrandA',
      obj_function: ['temperature_sensing'],
      obj_restriction: ['indoor_only'],
      obj_limitation: ['battery_powered'],
      obj_access: 5,
      obj_location: 1,
      obj_qualification: 80,
      obj_status: 1,
    };

    const resA = await request(app.getHttpServer() as unknown as App)
      .post('/object')
      .send(payload)
      .expect(201);
    objAId = resA.body._id;

    payload.obj_networkMAC = '00:1B:44:11:3A:B2';
    payload.obj_name = 'Interaction Obj B';
    const resB = await request(app.getHttpServer() as unknown as App)
      .post('/object')
      .send(payload)
      .expect(201);
    objBId = resB.body._id;
  });

  afterAll(async () => {
    await closeTestApp(app, mongoServer);
  });

  it('/interaction (POST) 201', async () => {
    const payload = {
      inter_obj_i: objAId,
      inter_obj_j: objBId,
      inter_start: new Date().toISOString(),
      inter_end: new Date(Date.now() + 60_000).toISOString(),
      inter_feedback: true,
      inter_service: 1,
    };

    const res = await request(app.getHttpServer() as unknown as App)
      .post('/interaction')
      .send(payload)
      .expect(201);
    interactionId = res.body._id;
    expect(interactionId).toBeDefined();
  });

  it('/interaction (GET) 200', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/interaction')
      .expect(200);
    const list = res.body as Array<{ _id: string }>;
    expect(Array.isArray(list)).toBeTruthy();
    expect(list.length).toBeGreaterThanOrEqual(1);
  });

  it('/interaction/:id (GET) 200', async () => {
    const id = interactionId as string;
    const res = await request(app.getHttpServer() as unknown as App)
      .get(`/interaction/${id}`)
      .expect(200);
    const obj = res.body as { _id: string };
    expect(obj._id).toBe(id);
  });

  it('/interaction/count-by-day (GET) 200', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/interaction/count-by-day')
      .expect(200);
    const stats = res.body as Array<{ _id: string; total: number }>;
    expect(Array.isArray(stats)).toBeTruthy();
  });

  it('/interaction/time-series (GET) 200', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/interaction/time-series')
      .expect(200);
    const series = res.body as Array<{ date: string; interactions: number }>;
    expect(Array.isArray(series)).toBeTruthy();
  });
});
