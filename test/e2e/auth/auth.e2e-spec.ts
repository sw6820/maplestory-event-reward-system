import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../apps/auth/src/app.module';

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 20000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it('POST /auth/register - should register a new user', async () => {
    const dto = {
      username: 'e2euser',
      password: 'password123',
      email: 'e2euser@example.com',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(409);
    expect(response.body).not.toHaveProperty('password');
  });

  it('POST /auth/login - should login with valid credentials', async () => {
    // Register first
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'e2elogin',
        password: 'password123',
        email: 'e2elogin@example.com',
      });
    // Then login
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'e2elogin',
        password: 'password123',
      })
      .expect(200);
    expect(response.body).toHaveProperty('access_token');
  });
}); 