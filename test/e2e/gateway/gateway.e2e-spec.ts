import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../apps/gateway/src/app.module';

describe('Gateway E2E', () => {
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

  it('GET / - should return Hello World!', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .expect(200);
    expect(response.text).toBe('Hello World!');
  });
}); 