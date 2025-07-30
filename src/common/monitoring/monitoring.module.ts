import { Module } from '@nestjs/common';
import { PrometheusModule, makeCounterProvider, makeHistogramProvider, makeGaugeProvider } from '@willsoto/nestjs-prometheus';
import { MonitoringController } from './monitoring.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    PrometheusModule.register(),
  ],
  controllers: [MonitoringController],
  providers: [
    MetricsService,
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route'],
    }),
    makeCounterProvider({
      name: 'http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeGaugeProvider({
      name: 'active_connections',
      help: 'Number of active connections',
    }),
    makeCounterProvider({
      name: 'task_operations_total',
      help: 'Total number of task operations',
      labelNames: ['operation', 'status', 'user_role'],
    }),
  ],
  exports: [MetricsService],
})
export class MonitoringModule {}
