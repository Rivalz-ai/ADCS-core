import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { join } from 'path'
import { MODE, REDIS_HOST, REDIS_PORT } from './app.settings'
import { BullModule } from '@nestjs/bullmq'
import { AdaptorModule } from './adaptor/adaptor.module'
import { ListenerModule } from './listener/listener.module'
import { ReporterModule } from './reporter/reporter.module'
import { InferenceModule } from './inference/inference.module'
import { ProviderModule } from './providers/provider.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', MODE == 'dev' ? '' : '..', 'data'),
      serveRoot: '/adcs'
    }),
    BullModule.forRoot({
      connection: {
        host: REDIS_HOST,
        port: Number(REDIS_PORT)
      }
    }),
    AdaptorModule,
    ListenerModule,
    ReporterModule,
    InferenceModule,
    ProviderModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService]
})
export class AppModule {}
