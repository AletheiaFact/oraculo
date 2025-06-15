import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ClaimService } from './claim.service';

@Controller('api/claim')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) { }

  @Post()
  async createClaim(
    @Body() body: any,
    @Headers('Authorization') authHeader: string,
  ) {
    try {
      const result = await this.claimService.createClaimInMainSystem(body, authHeader);
      return result;
    } catch (error) {
      console.error('Erro ao criar claim:', error);
      throw error;
    }
  }
}
