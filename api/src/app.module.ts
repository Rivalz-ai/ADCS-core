import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { join } from 'path'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { MODE, REDIS_HOST, REDIS_PORT } from './app.settings'
import { BullModule } from '@nestjs/bullmq'
import { AdaptorModule } from './adaptor/adaptor.module'
import { ListenerModule } from './listener/listener.module'
import { ReporterModule } from './reporter/reporter.module'

@Module({
  imports: [
    CacheModule.register({
      ttl: 10000,
      max: 20,
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 5000,
        limit: 50
      }
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', MODE == 'dev' ? '' : '..', 'data'),
      serveRoot: '/fragmentz'
    }),
    BullModule.forRoot({
      connection: {
        host: REDIS_HOST,
        port: Number(REDIS_PORT)
      }
    }),
    AdaptorModule,
    ListenerModule,
    ReporterModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
