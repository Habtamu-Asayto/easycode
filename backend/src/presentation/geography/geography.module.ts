import { Module } from '@nestjs/common';

// Controllers
import {
  RegionController,
  ZoneController,
  WoredaController,
  KebeleController,
} from './controllers';

// Providers
import {
  repositoryProviders,
  useCaseProviders,
} from './providers/geography.providers'; 
@Module({
  controllers: [
    RegionController,
    ZoneController,
    WoredaController,
    KebeleController, 
  ],
  providers: [...repositoryProviders, ...useCaseProviders],
  exports: [...repositoryProviders],
})
export class GeographyModule {}