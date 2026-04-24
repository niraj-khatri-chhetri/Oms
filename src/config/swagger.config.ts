import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Accord Pharma Backend Test API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addCookieAuth(
      'accessToken',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'JWT access token from HttpOnly cookie',
      },
      'accessTokenAuth',
    )
    .addCookieAuth(
      'refreshToken',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'refreshToken',
        description: 'JWT refresh token from HttpOnly cookie',
      },
      'refreshTokenAuth',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      withCredentials: true,
      persistAuthorization: true,
    },
  });
}
