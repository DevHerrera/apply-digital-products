import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@auth/controllers';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-token'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getToken should return a signed JWT', () => {
    const result = controller.getToken();
    expect(result).toEqual({ access_token: 'mocked-token' });
    expect(jwtService['sign']).toHaveBeenCalledWith({});
  });
});
