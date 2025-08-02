import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  private readonly hydraAdminUrl = 'http://localhost:4445';
  private readonly hydraPublicUrl = 'http://localhost:4444';
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private readonly logger = new Logger(AuthService.name);

  constructor(
      private readonly configService: ConfigService
    ) {}

  async createOAuth2Client(clientName: string, scopes: string[]) {
    try {
      const response = await fetch(`${this.hydraAdminUrl}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_name: clientName,
          grant_types: ['client_credentials'],
          response_types: ['token'],
          scope: scopes.join(' '),
          token_endpoint_auth_method: 'client_secret_post',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw new HttpException(
        'Failed to create OAuth2 client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateClientCredentialsToken(
    clientId: string,
    clientSecret: string,
    scope: string  = '',
  ) {
    try {
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const formData = new URLSearchParams({
        grant_type: 'client_credentials',
        scope,
      });

      const response = await fetch(`${this.hydraPublicUrl}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw new HttpException(
        'Failed to generate token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async introspectToken(token: string) {
    try {
      const formData = new URLSearchParams({
        token,
      });

      const response = await fetch(`${this.hydraAdminUrl}/oauth2/introspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw new HttpException(
        'Failed to introspect token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    async getToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.tokenExpiresAt) {
      return this.cachedToken;
    }

    const scope = this.configService.get<string>('OAUTH_SCOPE') || '';
    const clientId = this.configService.get<string>("CLIENT_ID");
    const clientSecret = this.configService.get<string>("CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      throw new Error("CLIENT_ID or CLIENT_SECRET are not defined in .env");
    }

    const tokenData = await this.generateClientCredentialsToken(
      clientId,
      clientSecret,
      scope
    );

    this.cachedToken = tokenData.access_token;
    this.tokenExpiresAt = Date.now() + tokenData.expires_in * 1000 - 60 * 1000;

    this.logger.log(`Token obtained successfully. Expires in ${tokenData.expires_in}s`);
    return this.cachedToken;
  }
}
