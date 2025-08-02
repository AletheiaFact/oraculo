import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import axios from 'axios';

@Injectable()
export class VerificationRequestService {
  private readonly logger = new Logger(VerificationRequestService.name);

  constructor(
    private readonly authService: AuthService,
  ) {}

  async createVerificationRequestInMainSystem(body: any) {
    const token = await this.authService.getToken();

    try {
      const response = await axios.post("http://localhost:4000/api/verification-request", body, {
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
