import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ClaimService {
  async createClaimInMainSystem(body: any, authHeader: string) {
    const response = await axios.post('http://localhost:4000/api/claim', body, {
      headers: {
        Authorization: authHeader,
      },
    });

    return response.data;
  }
}
