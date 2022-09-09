import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { User } from '../users/models/user.model';
import { Pet } from './models/pet.model';
import { AppModule } from '../app/app.module';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('PetsResolver (e2e)', () => {
  let app: INestApplication;
  let petsRepository: Repository<Pet>;
  let usersRepository: Repository<User>;
  let user: User;
  let pet: Pet;
  const gql = '/graphql';

  beforeEach(async () => {
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
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    petsRepository = moduleFixture.get('PetRepository');
    usersRepository = moduleFixture.get('UserRepository');
  });

  beforeEach(async () => {
    user = await usersRepository.save({
      username: 'test_user',
      password: 'password',
    });
    pet = await petsRepository.save({
      name: 'Test Pet 1',
      owner: user,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await petsRepository.clear();
    await usersRepository.clear();
  });

  describe('createPet', () => {
    it('should create a pet', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createPet(createPetInput: {
                name: "Test Pet 2",
                ownerId: "${user.id}",
              }) {
                id
                name
                owner {
                  id
                }
              }
            }
          `,
        })
        .expect(200)
        .expect(async ({ body }) => {
          expect(body.data.createPet).toEqual({
            id: expect.any(String),
            name: 'Test Pet 2',
            owner: { id: user.id },
          });
          const pets = await petsRepository.find();
          expect(pets).toHaveLength(2);
        }));

    it('should throw an error if the owner does not exist', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createPet(createPetInput: {
                name: "Test Pet 2",
                ownerId: "${randomUUID()}",
              }) {
                id
                name
                owner {
                  id
                }
              }
            }
          `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.errors).toHaveLength(1);
          expect(body.errors[0].message).toEqual('User not found');
        }));
  });

  describe('findPets', () => {
    it('should return an array of pets', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            query {
              pets {
                id
                name
                owner {
                  id
                  username
                }
              }
            }
          `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.pets).toEqual([
            {
              id: pet.id,
              name: pet.name,
              owner: {
                id: user.id,
                username: user.username,
              },
            },
          ]);
        });
    });
  });

  describe('findPet', () => {
    it('should return a pet', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            query {
              pet(id: "${pet.id}") {
                id
                name
                owner {
                  id
                  username
                }
              }
            }
          `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.data.pet).toEqual({
            id: pet.id,
            name: pet.name,
            owner: {
              id: user.id,
              username: user.username,
            },
          });
        }));

    it('should return an error when pet is not found', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            pet(id: "${randomUUID()}") {
              id
              name
              owner {
                id
                username
              }
            }
          }
        `,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.errors).toHaveLength(1);
          expect(body.errors[0].message).toEqual('Pet not found');
        }));
  });

  describe('updatePet', () => {
    it('should update a pet', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updatePet(updatePetInput: {
                id: "${pet.id}",
                name: "Test Pet 2",
              }) {
                id
                name
              }
            }
          `,
        })
        .expect(200)
        .expect(async ({ body }) => {
          expect(body.data.updatePet).toEqual({
            id: pet.id,
            name: 'Test Pet 2',
          });
        }));
  });

  describe('removePet', () => {
    it('should delete a pet', async () =>
      request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              removePet(id: "${pet.id}") {
                id
              }
            }
          `,
        })
        .expect(200)
        .expect(async ({ body }) => {
          expect(body.data.removePet).toEqual({
            id: pet.id,
          });
          const pets = await petsRepository.find();
          expect(pets).toHaveLength(0);
        }));
  });
});
