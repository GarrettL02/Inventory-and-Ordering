import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
//import { AuthEnvSchema } from './auth/schema/auth.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //const env = AuthEnvSchema.parse(process.env);

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
