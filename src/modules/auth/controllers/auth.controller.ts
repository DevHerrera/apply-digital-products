import { PublicAccess } from '@auth/decorators';
import { Controller, Get } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('get-token')
  @PublicAccess()
  getToken() {
    return {
      access_token: this.jwtService.sign({}),
    };
  }
}
