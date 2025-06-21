import { Controller, Post, Body } from '@nestjs/common';
import { ClaimService } from './claim.service';

@Controller('api/claim')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) { }

  @Post()
  async createClaim(@Body() body: any) {
    return this.claimService.createClaimInMainSystem(body);
  }
}
