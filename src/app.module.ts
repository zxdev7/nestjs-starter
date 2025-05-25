import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AwsS3Service } from './utils/s3.service';
import { RandomService } from './utils/random.service';
import { PasswordService } from './utils/password.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, AwsS3Service, RandomService, PasswordService],
})
export class AppModule {}
