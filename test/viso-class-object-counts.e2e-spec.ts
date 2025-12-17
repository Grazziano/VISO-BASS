import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, closeTestApp } from './e2e-utils';
import type { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(30000);

describe('VisoClass object counts (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let objectIds: string[] = [];

  beforeAll(async () => {
    const created = await createTestApp({
      userId: 'user01',
      email: 'user01@example.com',
    });
    app = created.app;
    mongoServer = created.mongoServer;
  });

  afterAll(async () => {
    await closeTestApp(app, mongoServer);
  });

  it('setup: create two objects', async () => {
    const server = app.getHttpServer() as unknown as App;
    const payloadBase = {
      obj_networkMAC: 'AA:BB:CC:DD:EE:FF',
      obj_name: 'Obj',
      obj_model: 'M1',
      obj_brand: 'B1',
      obj_function: ['f1'],
      obj_restriction: ['r1'],
      obj_limitation: ['l1'],
      obj_access: 1,
      obj_location: 1,
      obj_qualification: 1,
      obj_status: 1,
    };
    const res1 = await request(server)
      .post('/object')
      .send({
        ...payloadBase,
        obj_networkMAC: '00:1B:44:11:3A:B1',
        obj_name: 'Obj 1',
      })
      .expect(201);
    const res2 = await request(server)
      .post('/object')
      .send({
        ...payloadBase,
        obj_networkMAC: '00:1B:44:11:3A:B2',
        obj_name: 'Obj 2',
      })
      .expect(201);
    objectIds = [res1.body._id as string, res2.body._id as string];
    expect(objectIds.every((id) => typeof id === 'string')).toBeTruthy();
  });

  it('setup: create class referencing those objects', async () => {
    const server = app.getHttpServer() as unknown as App;
    const res = await request(server)
      .post('/class')
      .send({
        class_name: 'Classe Teste',
        class_function: ['example'],
        objects: objectIds,
      })
      .expect(201);
    expect(res.body.class_name).toBe('Classe Teste');
  });

  it('/class/object-counts (GET) 200 returns counts', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/class/object-counts')
      .expect(200);
    const payload = res.body as Array<{
      class_id: string;
      class_name: string;
      total: number;
    }>;
    expect(Array.isArray(payload)).toBeTruthy();
    const entry = payload.find((e) => e.class_name === 'Classe Teste');
    expect(entry).toBeDefined();
    expect(typeof entry?.total).toBe('number');
    expect(entry?.total).toBe(2);
  });
});
