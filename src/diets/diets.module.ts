import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DietsService } from './diets.service';
import { DietsController } from './diets.controller';
import { Diet } from './entities/diet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diet])],
  controllers: [DietsController],
  providers: [DietsService],
})
export class DietsModule {}
