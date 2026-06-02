import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SetupService } from './setup.service';

@ApiTags('Setup')
@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check if the system is already initialized' })
  @ApiResponse({ status: 200, description: 'Status retrieved successfully' })
  async getStatus() {
    return this.setupService.getStatus();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initialize the system' })
  @ApiResponse({ status: 201, description: 'System initialized successfully' })
  @ApiResponse({ status: 403, description: 'System already initialized' })
  async initialize(@Body() data: any) {
    return this.setupService.initialize(data);
  }

  @Post('test-connection')
  @ApiOperation({ summary: 'Test a database connection' })
  async testConnection(@Body() config: any) {
    return this.setupService.testConnection(config);
  }

  @Post('save-db-config')
  @ApiOperation({ summary: 'Save database configuration' })
  async saveDbConfig(@Body() config: any) {
    return this.setupService.saveDbConfig(config);
  }
}
