import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly hydraAdminUrl = 'http://localhost:4445';
  private readonly hydraPublicUrl = 'http://localhost:4444';

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
    scope: string,
  ) {
    try {
      const formData = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope,
      });

      const response = await fetch(`${this.hydraPublicUrl}/oauth2/token`, {
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
}
