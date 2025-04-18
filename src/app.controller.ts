import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

interface TokenRequestDto {
  clientId: string;
  clientSecret: string;
  scope: string;
}

interface TokenIntrospectionDto {
  token: string;
}

@Controller('oauth2')
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Post('token')
  @HttpCode(200)
  async generateToken(@Body() body: TokenRequestDto) {
    return this.authService.generateClientCredentialsToken(
      body.clientId,
      body.clientSecret,
      body.scope,
    );
  }

  @Post('introspect')
  @HttpCode(200)
  async introspectToken(@Body() body: TokenIntrospectionDto) {
    return this.authService.introspectToken(body.token);
  }
}
