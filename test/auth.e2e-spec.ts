import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/auth/schemas/user.schema';

import request = require('supertest');

describe('/auth/signup', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();

    const userModel = app.get(getModelToken(User.name));
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('signs up a user with roles', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'admin@a.com', password: 'secret123', roles: ['admin'] })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('admin@a.com');
  });

  it('rejects duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'dup@ex.com', password: 'secret123' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'dup@ex.com', password: 'secret123' })
      .expect(409);
  });
});
