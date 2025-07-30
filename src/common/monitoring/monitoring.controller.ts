import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { MetricsService } from './metrics.service';
import { PrometheusController } from '@willsoto/nestjs-prometheus';

@ApiTags('monitoring')
@Controller('health')
export class MonitoringController extends PrometheusController {
  constructor(private readonly metricsService: MetricsService) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  health() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  @ApiResponse({ status: 200, description: 'Prometheus metrics' })
  async metrics(@Res() response: Response) {
    return super.index(response);
  }

  @Get('app-metrics')
  @ApiOperation({ summary: 'Get application metrics' })
  @ApiResponse({ status: 200, description: 'Application metrics' })
  getAppMetrics() {
    return this.metricsService.getMetrics();
  }
}
