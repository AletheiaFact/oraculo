import { Module } from '@nestjs/common';
import { VerificationRequestController } from './verificationRequest.controller';
import { VerificationRequestService } from './verificationRequest.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [AuthModule],
  controllers: [VerificationRequestController],
  providers: [VerificationRequestService, AuthService],
})
export class VerificationRequestModule { }
