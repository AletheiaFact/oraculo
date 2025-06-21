import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import axios from 'axios';

@Injectable()
export class ClaimService {
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private readonly logger = new Logger(ClaimService.name);

  constructor(private readonly authService: AuthService) { }

  async getToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.tokenExpiresAt) {
      return this.cachedToken;
    }

    const scopes = ['openid', 'offline_access'];
    const client = await this.authService.createOAuth2Client('aletheia-client', scopes);

    const tokenData = await this.authService.generateClientCredentialsToken(
      client.client_id,
      client.client_secret,
      scopes.join(' '),
    );

    this.cachedToken = tokenData.access_token;
    this.tokenExpiresAt = Date.now() + tokenData.expires_in * 1000 - 60 * 1000;

    this.logger.log(`Token obtido com sucesso. Expira em ${tokenData.expires_in}s`);
    return this.cachedToken;
  }

  async createClaimInMainSystem(body: any) {
    const token = await this.getToken();

    try {
      const response = await axios.post('http://localhost:4000/api/claim', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
