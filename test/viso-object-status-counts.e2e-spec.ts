import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, closeTestApp } from './e2e-utils';
import type { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(30000);

describe('VisoObject status counts (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

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

  it('setup: create objects with different statuses', async () => {
    const server = app.getHttpServer() as unknown as App;
    const base = {
      obj_networkMAC: '00:1B:44:11:3A:',
      obj_model: 'M',
      obj_brand: 'B',
      obj_function: ['f'],
      obj_restriction: ['r'],
      obj_limitation: ['l'],
      obj_access: 1,
      obj_location: 1,
      obj_qualification: 1,
    };

    await request(server)
      .post('/object')
      .send({
        ...base,
        obj_networkMAC: '00:1B:44:11:3A:A1',
        obj_name: 'Online 1',
        obj_status: 1,
      })
      .expect(201);
    await request(server)
      .post('/object')
      .send({
        ...base,
        obj_networkMAC: '00:1B:44:11:3A:B1',
        obj_name: 'Offline 1',
        obj_status: 2,
      })
      .expect(201);
    await request(server)
      .post('/object')
      .send({
        ...base,
        obj_networkMAC: '00:1B:44:11:3A:B2',
        obj_name: 'Offline 2',
        obj_status: 2,
      })
      .expect(201);
    await request(server)
      .post('/object')
      .send({
        ...base,
        obj_networkMAC: '00:1B:44:11:3A:C1',
        obj_name: 'Manutenção 1',
        obj_status: 3,
      })
      .expect(201);
  });

  it('/object/status-counts (GET) 200 returns counts by status with labels', async () => {
    const res = await request(app.getHttpServer() as unknown as App)
      .get('/object/status-counts')
      .expect(200);
    const payload = res.body as Array<{
      status_code: number;
      status: string;
      total: number;
    }>;
    expect(Array.isArray(payload)).toBeTruthy();
    const online = payload.find((e) => e.status_code === 1);
    const offline = payload.find((e) => e.status_code === 2);
    const manutencao = payload.find((e) => e.status_code === 3);
    expect(online?.status).toBe('online');
    expect(offline?.status).toBe('offline');
    expect(manutencao?.status).toBe('manutenção');
    expect(online?.total).toBeGreaterThanOrEqual(1);
    expect(offline?.total).toBeGreaterThanOrEqual(2);
    expect(manutencao?.total).toBeGreaterThanOrEqual(1);
  });
});
