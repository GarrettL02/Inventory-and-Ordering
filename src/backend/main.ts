import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { MAX_IMAGE_BYTES } from './partImages/schema/partImages.schema';
//import { AuthEnvSchema } from './auth/schema/auth.schema';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Part pictures are uploaded as the raw request body (no multipart). This parser
  // turns any image/* body into a Buffer on req.body and rejects bigger ones with 413.
  // Requests with other content types (JSON etc.) are not touched by it.
  app.useBodyParser('raw', { type: 'image/*', limit: MAX_IMAGE_BYTES });

  //const env = AuthEnvSchema.parse(process.env);

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
