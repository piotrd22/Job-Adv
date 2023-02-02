import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { JobDto, JobEditDto } from 'src/job/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(5000);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:5000/');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'mail@wp.pl',
      password: 'password',
    };

    describe('Signup', () => {
      it('should not singup because email is not an email', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({
            email: 'email',
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should not singup because email and password are empty', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({
            email: '',
            password: '',
          })
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should not signup bc same credentials', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });

      it('should signup 2', () => {
        return pactum
          .spec()
          .post('auth/signup')
          .withBody({
            email: 'mail@wp.com',
            password: dto.password,
          })
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should not singin because email is not an email', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({
            email: 'email',
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should not singin because email and password are empty', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({
            email: '',
            password: '',
          })
          .expectStatus(400);
      });

      it('should not singin because there are any user like this', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({
            email: 'mail@wp.com',
            password: 'fhjasdkl',
          })
          .expectStatus(403);
      });

      it('should not singin because bad password', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({
            email: dto.email,
            password: 'fhjasdkl',
          })
          .expectStatus(403);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });

      it('should signin 2', () => {
        return pactum
          .spec()
          .post('auth/signin')
          .withBody({
            email: 'mail@wp.com',
            password: dto.password,
          })
          .expectStatus(200)
          .stores('userAt2', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get profile', () => {
      it('should not get current user bc unauthorized', () => {
        return pactum.spec().get('users/profile').expectStatus(401);
      });

      it('should not get current user bc unauthorized v2', () => {
        return pactum
          .spec()
          .get('users/profile')
          .withHeaders({
            Authorization: 'Bearer dklasgfilausghdliu046378013624',
          })
          .expectStatus(401);
      });

      it('should get current user', () => {
        return pactum
          .spec()
          .get('users/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        name: 'Piotr',
        email: 'mail@wp.io',
      };
      it('should not edit user bc credentials taken', () => {
        return pactum
          .spec()
          .patch('users/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            name: dto.name,
            email: 'mail@wp.com',
          })
          .expectStatus(403);
      });

      it('should edit user', () => {
        return pactum
          .spec()
          .patch('users/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.email);
      });
    });

    describe('Delete user', () => {
      it('should delete user', () => {
        return pactum
          .spec()
          .delete('users/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt2}',
          })
          .expectStatus(200);
      });
    });

    describe('Get users', () => {
      it('should get all users', () => {
        return pactum.spec().get('users').expectStatus(200);
      });

      it('should not get deleted user', () => {
        return pactum
          .spec()
          .get('users/profile')
          .withHeaders({
            Authorization: 'Bearer $S{userAt2}',
          })
          .expectStatus(404);
      });
    });
  });

  describe('Job', () => {
    describe('Get all', () => {
      it('should get all jobs', () => {
        return pactum.spec().get('jobs?skip=0').expectStatus(200);
      });
    });

    describe('Create', () => {
      const dto: JobDto = {
        title: 'cool',
        description: 'cool work',
        tech: 'JS',
        position: 'Junior',
      };

      it('should not create job bc unathorized', () => {
        return pactum.spec().post('jobs').expectStatus(401);
      });

      it('should create job', () => {
        return pactum
          .spec()
          .post('jobs')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(201)
          .stores('jobId', 'id');
      });

      it('should create job', () => {
        return pactum
          .spec()
          .post('jobs')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(201);
      });

      it('should get two job', () => {
        return pactum
          .spec()
          .get('jobs?skip=0')
          .expectStatus(200)
          .expectJsonLength(2);
      });

      it('should get my jobs (2)', () => {
        return pactum
          .spec()
          .get('jobs/my')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(2);
      });

      it('should get job by id', () => {
        return pactum
          .spec()
          .get('jobs/{id}')
          .withPathParams('id', '$S{jobId}')
          .expectStatus(200)
          .expectBodyContains('$S{jobId}');
      });
    });

    describe('Update', () => {
      const dto: JobEditDto = {
        title: 'ezz',
        description: 'loool',
      };
      it('should not edit job', () => {
        return pactum
          .spec()
          .patch('jobs/{id}')
          .withPathParams('id', '$S{jobId}')
          .withBody(dto)
          .expectStatus(401);
      });

      it('should edit job', () => {
        return pactum
          .spec()
          .patch('jobs/{id}')
          .withPathParams('id', '$S{jobId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete', () => {
      it('should not delete job', () => {
        return pactum
          .spec()
          .delete('jobs/{id}')
          .withPathParams('id', '$S{jobId}')
          .expectStatus(401);
      });

      it('should delete job', () => {
        return pactum
          .spec()
          .delete('jobs/{id}')
          .withPathParams('id', '$S{jobId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });

      it('should get 1 job', () => {
        return pactum
          .spec()
          .get('jobs?skip=0')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
  });

  describe('Delete all', () => {
    it('should delete user', () => {
      return pactum
        .spec()
        .delete('users/profile')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200);
    });

    it('should get empty jobs', () => {
      return pactum
        .spec()
        .get('jobs?skip=0')
        .expectStatus(200)
        .expectJsonLength(0);
    });

    it('should get empty users', () => {
      return pactum.spec().get('users').expectStatus(200).expectJsonLength(0);
    });
  });
});
