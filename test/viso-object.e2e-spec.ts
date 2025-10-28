import { Test } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthGuard } from '@nestjs/passport';
import { VisoObjectService } from '../src/viso-object/viso-object.service';

describe('VisoObject (e2e)', () => {
  let app: INestApplication;

  const mockVisoObjectService = {
    create: jest
      .fn()
      .mockImplementation((dto: any, user: any) =>
        Promise.resolve({ ...dto, _id: '1', owner: user }),
      ),
    findAll: jest
      .fn()
      .mockResolvedValue([
        { _id: '1', name: 'obj', description: 'd', owner: { email: 'a' } },
      ]),
    findOne: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve({ _id: id, name: 'obj' }),
      ),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(VisoObjectService)
      .useValue(mockVisoObjectService)
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { _id: 'ownerId', email: 'owner@example.com' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/object (POST) 201', () => {
    return request(app.getHttpServer())
      .post('/object')
      .send({ name: 'obj', description: 'desc' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('obj');
        expect(res.body.owner).toMatchObject({ email: 'owner@example.com' });
      });
  });

  it('/object (GET) 200', () => {
    return request(app.getHttpServer())
      .get('/object')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0].name).toBe('obj');
      });
  });

  it('/object/:id (GET) 200', () => {
    return request(app.getHttpServer())
      .get('/object/123')
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe('123');
      });
  });
});
