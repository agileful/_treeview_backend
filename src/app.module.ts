import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MigrationModule } from './migration/migration.module'
import { StorageModule } from './storage/storage.module'
import { ServerModule } from './server/server.module';

@Module({
  imports: [ScheduleModule.forRoot(), MigrationModule, StorageModule, ServerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
