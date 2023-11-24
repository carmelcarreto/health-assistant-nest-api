import { Module } from '@nestjs/common';
import { DietsModule } from './diets/diets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), DietsModule,
            ConfigModule.forRoot({isGlobal: true})
          ],
  
  controllers: [],
  providers: [],
})
export class AppModule {}
