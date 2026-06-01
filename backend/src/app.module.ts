import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './business/business.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { ProductsModule } from './products/products.module';
import { GalleryModule } from './gallery/gallery.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { LeadsModule } from './leads/leads.module';
import { SeoModule } from './seo/seo.module';
import { DomainModule } from './domain/domain.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // Serve folder uploads/ sebagai static files: GET /uploads/filename.jpg
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),
    AuthModule,
    UsersModule,
    BusinessModule,
    LandingPageModule,
    ProductsModule,
    GalleryModule,
    TestimonialsModule,
    LeadsModule,
    SeoModule,
    DomainModule,
    AnalyticsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

