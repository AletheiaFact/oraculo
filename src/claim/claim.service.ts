import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import axios from 'axios';

@Injectable()
export class ClaimService {
  private readonly logger = new Logger(ClaimService.name);

  constructor(
    private readonly authService: AuthService,
  ) {}

  async createClaimInMainSystem(body: any) {
    const token = await this.authService.getToken();

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
