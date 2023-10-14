import { Module } from '@nestjs/common';
import { DietsModule } from './diets/diets.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [DietsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'S3cret',
      database: 'diet_database',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
