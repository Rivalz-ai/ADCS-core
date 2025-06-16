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
import { AuthModule } from './auth/auth.module'
import { InferenceModule } from './inference/inference.module'
import { ProviderModule } from './providers/provider.module'
import { ProviderV2Module } from './provider-v2/provider-v2.module';
import { AdapterV2Module } from './adapter-v2/adapter-v2.module';
import { AiModule } from './ai/ai.module';
import { NetworkModule } from './network/network.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 1000,
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
    AuthModule,
    InferenceModule,
    ProviderModule,
    ProviderV2Module,
    AdapterV2Module,
    AiModule,
    NetworkModule
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
