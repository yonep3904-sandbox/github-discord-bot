import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './modules/discord';
import { NotificationModule } from './modules/notifications';
@Module({
  imports: [DiscordModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
