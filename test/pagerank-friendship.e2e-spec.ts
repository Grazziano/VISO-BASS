import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, closeTestApp } from './e2e-utils';

// Increase default jest timeout for e2e (starting in-memory Mongo + Nest app can be slow)
jest.setTimeout(30000);

describe('PagerankFriendship (e2e)', () => {
  let app: INestApplication;
  let mongoServer: import('mongodb-memory-server').MongoMemoryServer;
  let objAId: string | undefined;
  let objBId: string | undefined;
  let prId: string | undefined;

  beforeAll(async () => {
    const created = await createTestApp({
      userId: 'frodoId',
      email: 'frodo.baggins@shire.middleearth',
    });
    app = created.app;
    mongoServer = created.mongoServer;

    // create two objects to reference
    const payload = {
      obj_networkMAC: '00:1B:44:11:3A:D1',
      obj_name: 'PR Obj A',
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

    payload.obj_networkMAC = '00:1B:44:11:3A:D2';
    payload.obj_name = 'PR Obj B';
    const resB = await request(app.getHttpServer() as unknown as App)
      .post('/object')
      .send(payload)
      .expect(201);
    objBId = resB.body._id;
  });

  afterAll(async () => {
    await closeTestApp(app, mongoServer);
  });

  it('/pagerank-friendship (POST) 201', async () => {
    const payload = {
      rank_object: objAId,
      rank_adjacency: [objBId],
    };

    const res = await request(app.getHttpServer() as unknown as App)
      .post('/pagerank-friendship')
      .send(payload)
      .expect(201);
    prId = res.body._id;
    expect(prId).toBeDefined();
  });

  it('/pagerank-friendship (GET) 200', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/pagerank-friendship')
      .expect(200);
    const list = res.body as Array<{ _id: string }>;
    expect(Array.isArray(list)).toBeTruthy();
  });

  it('/pagerank-friendship/relevant (GET) 200', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/pagerank-friendship/relevant')
      .expect(200);
    const list = res.body as Array<{ _id: string }>;
    expect(Array.isArray(list)).toBeTruthy();
  });

  it('/pagerank-friendship/:id (GET) 200', async () => {
    const id = prId as string;
    const res = await request(app.getHttpServer() as unknown as App)
      .get(`/pagerank-friendship/${id}`)
      .expect(200);
    const obj = res.body as { _id: string };
    expect(obj._id).toBe(id);
  });
});
