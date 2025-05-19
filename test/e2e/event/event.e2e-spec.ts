import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../apps/event/src/app.module';

describe('Event E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /events - should create an event', async () => {
    const dto = {
      title: 'E2E Event',
      condition: 'Login 3 days',
      status: 'ACTIVE',
      startAt: new Date(),
      endAt: new Date(),
    };
    const response = await request(app.getHttpServer())
      .post('/events')
      .send(dto)
      .expect(201);
    expect(response.body.title).toBe(dto.title);
  });

  it('GET /events - should return events', async () => {
    const response = await request(app.getHttpServer())
      .get('/events')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
}); 