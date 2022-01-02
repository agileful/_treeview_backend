import { Module } from '@nestjs/common'
import { MigrationModule } from 'src/migration/migration.module'
import { StorageModule } from 'src/storage/storage.module'
import { MigrationController } from './migration.controller'
import { MigrationInterface } from './migration.service'
import { StorageController } from './storage.controller'
import { StorageInterface } from './storage.service'

@Module({
  providers: [MigrationInterface, StorageInterface],
  controllers: [MigrationController, StorageController],
  imports: [MigrationModule, StorageModule],
})
export class ServerModule {}
