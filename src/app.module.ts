import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import configuration from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TimestampPlugin } from './common/plugins/timestamp.plugin';
import { HealthModule } from './health/health.module';
import { TasksModule } from './tasks/tasks.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('mongodb.url'),
          connectionFactory: (connection) => {
            connection.plugin(TimestampPlugin);

            return connection;
          },
        };
      },
    }),
    HealthModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
