import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, closeTestApp } from './e2e-utils';

jest.setTimeout(30000);

describe('VisoClass (e2e)', () => {
  let app: INestApplication;
  let mongoServer: import('mongodb-memory-server').MongoMemoryServer;
  let objectId: string | undefined;
  let classId: string | undefined;

  beforeAll(async () => {
    const created = await createTestApp({
      userId: 'legolasId',
      email: 'legolas@woodlandrealm.middleearth',
    });
    app = created.app;
    mongoServer = created.mongoServer;

    // create an object to reference
    const payload = {
      obj_networkMAC: '00:1B:44:11:3A:E1',
      obj_name: 'Class Obj',
      obj_model: 'ModelC',
      obj_brand: 'BrandC',
      obj_function: ['temperature_sensing'],
      obj_restriction: ['indoor_only'],
      obj_limitation: ['battery_powered'],
      obj_access: 5,
      obj_location: 1,
      obj_qualification: 80,
      obj_status: 1,
    };

    const server = app.getHttpServer() as unknown as App;
    const res = await request(server).post('/object').send(payload).expect(201);
    const body = res.body as { _id: string };
    objectId = body._id;
  });

  afterAll(async () => {
    await closeTestApp(app, mongoServer);
  });

  it('/class (POST) 201', async () => {
    const payload = {
      class_name: 'Test Class',
      class_function: ['temperature_monitoring'],
      objects: [objectId],
    };

    const res = await request(app.getHttpServer() as unknown as App)
      .post('/class')
      .send(payload)
      .expect(201);
    const body = res.body as { _id: string };
    classId = body._id;
    expect(classId).toBeDefined();
  });

  it('/class (GET) 200', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/class')
      .expect(200);
    const list = res.body as Array<{ _id: string }>;
    expect(Array.isArray(list)).toBeTruthy();
  });

  it('/class/:id (GET) 200', async () => {
    const id = classId as string;
    const res = await request(app.getHttpServer() as unknown as App)
      .get(`/class/${id}`)
      .expect(200);
    const obj = res.body as { _id: string };
    expect(obj._id).toBe(id);
  });
});
