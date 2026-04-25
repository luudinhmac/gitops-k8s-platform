import { Module, forwardRef } from '@nestjs/common';
import { MailService } from './mail.service';
import { SettingsModule } from '../modules/settings/settings.module';

@Module({
  imports: [forwardRef(() => SettingsModule)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
