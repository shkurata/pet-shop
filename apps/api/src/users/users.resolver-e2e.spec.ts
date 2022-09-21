import { ExecutionContext, INestApplication } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../app/app.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Pet } from '../pets/models/pet.model';
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
          entities: [User, Pet],
          logging: false,
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User, Pet]),
        AppModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const ctx = GqlExecutionContext.create(context);
          ctx.getContext().req.user = { isAdmin: true }; // Your user object
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    usersRepository = moduleFixture.get('UserRepository');
  });

  beforeEach(async () => {
    user = await usersRepository.save({
      username: 'test_user',
      password: 'password',
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
                createUser(createUserInput: { username: "test_user_2", password: "password" }) {
                    username
                }
            }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.createUser.username).toEqual('test_user_2');
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
                    username
                }
            }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.users).toEqual([{ username: 'test_user' }]);
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
                    username
                }
            }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.user.username).toEqual('test_user');
        }));

    it('should return an error if user not found', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            query {
                user(id: "${randomUUID()}") {
                    username
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
                updateUser(updateUserInput: { id: "${user.id}", username: "test_user_2" }) {
                    username
                }
            }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.updateUser.username).toEqual('test_user_2');
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
                    username
                }
            }
        `,
        })
        .expect(200)
        .expect(async ({ body }) => {
          expect(body.data.removeUser).toEqual({ username: 'test_user' });
          expect(await usersRepository.find()).toHaveLength(0);
        }));
  });
});
