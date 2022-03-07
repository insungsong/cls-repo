import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import {
  Environment,
  NestConfigService,
} from '@libs/common/config/nest-config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const message = errors
          .map((error) => Object.values(error.constraints))
          .join(',');
        throw new Error(message);
      },
    }),
  );

  const configService: NestConfigService =
    app.get<NestConfigService>(NestConfigService);

  if (configService.nodeEnv !== Environment.PRODUCTION) {
    const config = new DocumentBuilder()
      .setTitle('Nest Gateway')
      .setDescription('The Nest API description')
      .setVersion('1.0.0')
      .addTag('Nest')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'Authorization',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('v1/docs', app, document);
  }

  await app.listen(3001);
}
bootstrap();
