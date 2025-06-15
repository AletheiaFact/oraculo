import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ClaimModule } from './claim/claim.module';

@Module({
  imports: [AuthModule, ClaimModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule { }
