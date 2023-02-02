import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

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
          .expectStatus(200);
      });
    });
  });

  describe('User', () => {
    describe('Profile', () => {});
  });
});
