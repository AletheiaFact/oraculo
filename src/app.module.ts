import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ClaimModule } from './claim/claim.module';
import { ConfigModule } from '@nestjs/config';
import { VerificationRequestModule } from './verificationRequests/verificationRequest.module';

@Module({
  imports: [
    AuthModule,
    ClaimModule,
    VerificationRequestModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule { }
