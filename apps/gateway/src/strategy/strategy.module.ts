import { NestConfigModule } from '@libs/common/config/nest-config.module';
import { NestConfigService } from '@libs/common/config/nest-config.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';

/**
 * @TODO check
 */

@Module({
  imports: [
    PassportModule.register({ defatulStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [NestConfigModule],
      useFactory: async (config: NestConfigService) => ({
        secret: config.jwtSecret,
      }),
      inject: [NestConfigService],
    }),
  ],
  providers: [JwtStrategy],
})
export class StrategyModule {}
