import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common/enums/version-type.enum';
import { LoggingInterceptor } from './common/logger/logging.interceptor';
import { requestIdMiddleware } from './common/middleware/request-id.middleware';
import { RequestContextService } from './common/middleware/request-context.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Data Encryption API')
    .setDescription('API for encrypting and decrypting data using AES-256-CBC algorithm')
    .setVersion('1.0')
    .addTag('encryption')
    .addServer('/api/v1')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api');

  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalInterceptors(app.get(LoggingInterceptor));

  const requestContext = app.get(RequestContextService);
  app.use(requestIdMiddleware(requestContext));

  app.use(
    bodyParser.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
