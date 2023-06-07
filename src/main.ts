import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptor/transform/transform.interceptor';
import { HttpExecptionFilter } from './filters/http-execption/http-execption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**使用全局拦截 */
  app.useGlobalInterceptors(new TransformInterceptor());

  /**使用全局异常过滤器 */
  app.useGlobalFilters(new HttpExecptionFilter());

  /**配置跨域 */
  app.enableCors();

  await app.listen(8000);
}
bootstrap();
