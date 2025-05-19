import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'maple-secret', // In production, use environment variable
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtStrategy, RolesGuard],
})
export class GatewayModule {}
