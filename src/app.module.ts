import { Module } from '@nestjs/common';
import { DietsModule } from './diets/diets.module';

@Module({
  imports: [DietsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
