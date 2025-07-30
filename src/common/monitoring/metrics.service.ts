import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,
    @InjectMetric('http_errors_total')
    private readonly httpErrorsTotal: Counter<string>,
    @InjectMetric('active_connections')
    private readonly activeConnections: Gauge<string>,
    @InjectMetric('task_operations_total')
    private readonly taskOperationsTotal: Counter<string>,
  ) {}

  incrementRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
  }

  recordResponseTime(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe({ method, route }, duration / 1000);
  }

  incrementErrors(method: string, route: string, statusCode: number) {
    this.httpErrorsTotal.inc({ method, route, status_code: statusCode });
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count);
  }

  incrementTaskOperation(operation: string, status: string, userRole: string) {
    this.taskOperationsTotal.inc({ operation, status, user_role: userRole });
  }

  getMetrics() {
    return {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }
}
