import { PrometheusOptions } from '@willsoto/nestjs-prometheus';

export const metricsConfig: PrometheusOptions = {
  customMetricPrefix: 'nestjs_',
};
