import { Module, Controller, Get } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return 'Hello World!';
  }
}

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [JwtStrategy],
    controllers: [AppController],
})
export class AppModule { }
