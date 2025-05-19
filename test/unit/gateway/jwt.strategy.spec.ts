import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../../../apps/gateway/src/auth/jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: ConfigService,
                    useValue: { get: jest.fn().mockReturnValue('test-secret') },
                },
            ],
        }).compile();

        strategy = module.get<JwtStrategy>(JwtStrategy);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    it('should return user object with userId and role from payload', async () => {
        const payload = { sub: '123', role: 'admin' };
        const result = await strategy.validate(payload);
        expect(result).toEqual({ userId: '123', role: 'admin' });
    });

    it('should handle missing role in payload', async () => {
        const payload = { sub: '456' };
        const result = await strategy.validate(payload);
        expect(result).toEqual({ userId: '456', role: undefined });
    });

    it('should handle missing sub in payload', async () => {
        const payload = { role: 'user' };
        const result = await strategy.validate(payload);
        expect(result).toEqual({ userId: undefined, role: 'user' });
    });
});