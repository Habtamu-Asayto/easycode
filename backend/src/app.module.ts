import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { GeographyModule } from './presentation/geography/geography.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GeographyModule,
  ], 
})
export class AppModule {}