import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SeoService } from '../services/seo.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('seo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Post('analyze')
  @Roles('admin', 'superadmin', 'editor')
  async analyze(@Body() data: { content: string; title: string }) {
    return this.seoService.analyzeContent(data.content, data.title);
  }

  @Post('suggest-keywords')
  @Roles('admin', 'superadmin', 'editor')
  async suggestKeywords(@Body() data: { topic: string }) {
    return this.seoService.suggestKeywords(data.topic);
  }
}
