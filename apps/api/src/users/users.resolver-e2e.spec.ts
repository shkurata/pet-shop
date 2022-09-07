import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../app/app.module';
import { User } from './models/user.model';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let user: User;
  const gql = '/graphql';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [User],
          logging: false,
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User]),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    usersRepository = moduleFixture.get('UserRepository');
  });

  beforeEach(async () => {
    user = await usersRepository.save({
      name: 'Test User',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await usersRepository.clear();
  });

  describe('createUser', () => {
    it('should create a user', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
                createUser(createUserInput: { name: "Test User 2" }) {
                    name
                }
            }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.createUser.name).toEqual('Test User 2');
        }));
  });

  describe('users', () => {
    it('should return an array of users', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            query {
                users {
                    name
                }
            }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.users).toEqual([{ name: 'Test User' }]);
        }));
  });

  describe('user', () => {
    it('should return a user', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            query {
                user(id: "${user.id}") {
                    name
                }
            }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.user.name).toEqual('Test User');
        }));

    it('should return an error if user not found', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            query {
                user(id: "${randomUUID()}") {
                    name
                }
            }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.errors).toBeDefined();
        }));
  });

  describe('updateUser', () => {
    it('should update a user', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
                updateUser(updateUserInput: { id: "${user.id}", name: "Test User 2" }) {
                    name
                }
            }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.updateUser.name).toEqual('Test User 2');
        }));
  });

  describe('removeUser', () => {
    it('should delete a user', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
                removeUser(id: "${user.id}") {
                    name
                }
            }
        `,
        })
        .expect(200)
        .expect(async ({ body }) => {
          expect(body.data.removeUser).toEqual({ name: 'Test User' });
          expect(await usersRepository.find()).toHaveLength(0);
        }));
  });
});
