import { Controller, Post, Body } from '@nestjs/common';
import { VerificationRequestService } from './verificationRequest.service';

@Controller('external-api/verification-request')
export class VerificationRequestController {
  constructor(private readonly verificationRequestService: VerificationRequestService) {}

  @Post()
  async createVerificationRequest(@Body() body: any) {
    return this.verificationRequestService.createVerificationRequestInMainSystem(body);
  }
}
