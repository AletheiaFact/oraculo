import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from "@nestjs/config";
import axios from 'axios';

@Injectable()
export class ClaimService {
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private readonly logger = new Logger(ClaimService.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

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

    const tokenData = await this.authService.generateClientCredentialsToken(
      clientId,
      clientSecret,
      scope
    );

    this.cachedToken = tokenData.access_token;
    this.tokenExpiresAt = Date.now() + tokenData.expires_in * 1000 - 60 * 1000;

    this.logger.log(`Token obtained successfully. Expires in ${tokenData.expires_in}s`);
    return this.cachedToken;
  }

  async createClaimInMainSystem(body: any) {
    const token = await this.getToken();

    try {
      const response = await axios.post("http://localhost:4000/api/claim", body, {
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
