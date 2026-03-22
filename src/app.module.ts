import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './modules/discord';
import { NotificationModule } from './modules/notifications';
import { ManualNotificationModule } from './modules/manual';
@Module({
  imports: [DiscordModule, NotificationModule, ManualNotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
