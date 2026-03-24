import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './modules/discord';
import { NotificationModule } from './modules/notifications';
import { ManualNotificationModule } from './modules/manual';
import { GithubModule } from './modules/github';

@Module({
  imports: [
    DiscordModule,
    NotificationModule,
    ManualNotificationModule,
    GithubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
