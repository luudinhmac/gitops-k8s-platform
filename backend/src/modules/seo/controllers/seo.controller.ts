import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SeoService } from '../services/seo.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { Permissions } from '../../auth/permissions.decorator';

@Controller('seo')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Post('analyze')
  @Permissions('posts:create')
  async analyze(@Body() data: { content: string; title: string }) {
    return this.seoService.analyzeContent(data.content, data.title);
  }

  @Post('suggest-keywords')
  @Permissions('posts:create')
  async suggestKeywords(@Body() data: { topic: string }) {
    return this.seoService.suggestKeywords(data.topic);
  }
}
