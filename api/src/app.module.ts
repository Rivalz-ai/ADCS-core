import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { join } from 'path'
import { MODE, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USER } from './app.settings'
import { BullModule } from '@nestjs/bullmq'
import { AdaptorModule } from './adaptor/adaptor.module'
import { ListenerModule } from './listener/listener.module'
import { ReporterModule } from './reporter/reporter.module'
import { InferenceModule } from './inference/inference.module'
import { ProviderModule } from './providers/provider.module'
import { CacheModule } from '@nestjs/cache-manager'
import { ZeroModule } from './zero/zero.module'
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', MODE == 'dev' ? '' : '..', 'data'),
      serveRoot: '/adcs'
    }),
    BullModule.forRoot({
      connection: {
        host: REDIS_HOST,
        port: Number(REDIS_PORT),
        username: REDIS_USER,
        password: REDIS_PASSWORD
      }
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60 * 5 // 5 minutes
    }),
    AdaptorModule,
    ListenerModule,
    ReporterModule,
    InferenceModule,
    ProviderModule,
    ZeroModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService]
})
export class AppModule {}
