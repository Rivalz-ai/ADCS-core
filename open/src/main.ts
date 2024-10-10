import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setAppSetting } from './app.settings'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  setAppSetting(app)
  const version = '1.0'
  const config = new DocumentBuilder()
    .setTitle('ADCS open API')
    .setDescription('ADCS open API description')
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'apiKey',
        scheme: 'JWT',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Type into the text box: Bearer {your JWT token}',
        in: 'header'
      },
      'JWT'
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('open/docs', app, document)
  const configService = app.get(ConfigService)
  const port = configService.get('APP_PORT')
  const server = await app.listen(port)
  server.setTimeout(5000)
  console.log(`app started with ${port}`)
}
bootstrap().catch((error) => {
  console.log('exit app with error', { error })
  process.exit(1)
})
