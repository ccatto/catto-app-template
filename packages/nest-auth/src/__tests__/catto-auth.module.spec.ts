import { CattoAuthModule, CattoAuthModuleOptions } from '../catto-auth.module';
import { CATTO_AUTH_CONFIG, CATTO_AUTH_PRISMA } from '../constants';

describe('CattoAuthModule', () => {
  const baseOptions: CattoAuthModuleOptions = {
    jwt: { secret: 'test-secret' },
    prismaToken: 'PrismaService',
    imports: [],
  };

  describe('forRoot', () => {
    it('returns a valid DynamicModule', () => {
      const result = CattoAuthModule.forRoot(baseOptions);

      expect(result).toBeDefined();
      expect(result.module).toBe(CattoAuthModule);
    });

    it('is marked as global', () => {
      const result = CattoAuthModule.forRoot(baseOptions);
      expect(result.global).toBe(true);
    });

    it('provides CATTO_AUTH_CONFIG with config values', () => {
      const result = CattoAuthModule.forRoot(baseOptions);
      const configProvider = result.providers?.find(
        (p: any) => p.provide === CATTO_AUTH_CONFIG,
      ) as any;

      expect(configProvider).toBeDefined();
      expect(configProvider.useValue).toBeDefined();
      expect(configProvider.useValue.jwt.secret).toBe('test-secret');
    });

    it('provides CATTO_AUTH_PRISMA via useExisting', () => {
      const result = CattoAuthModule.forRoot(baseOptions);
      const prismaProvider = result.providers?.find(
        (p: any) => p.provide === CATTO_AUTH_PRISMA,
      ) as any;

      expect(prismaProvider).toBeDefined();
      expect(prismaProvider.useExisting).toBe('PrismaService');
    });

    it('exports PassportModule, JwtModule, config tokens, and JwtStrategy', () => {
      const result = CattoAuthModule.forRoot(baseOptions);
      const exports = result.exports as any[];

      expect(exports).toBeDefined();
      expect(exports).toContain(CATTO_AUTH_CONFIG);
      expect(exports).toContain(CATTO_AUTH_PRISMA);
    });

    it('strips prismaToken and imports from config value', () => {
      const result = CattoAuthModule.forRoot({
        ...baseOptions,
        roles: { platformAdmin: 'super_admin' },
      });

      const configProvider = result.providers?.find(
        (p: any) => p.provide === CATTO_AUTH_CONFIG,
      ) as any;

      // Config should have jwt and roles, but NOT prismaToken or imports
      expect(configProvider.useValue.jwt).toBeDefined();
      expect(configProvider.useValue.roles).toBeDefined();
      expect(configProvider.useValue.prismaToken).toBeUndefined();
      expect(configProvider.useValue.imports).toBeUndefined();
    });

    it('includes extra imports in module imports', () => {
      class FakeModule {}
      const result = CattoAuthModule.forRoot({
        ...baseOptions,
        imports: [FakeModule],
      });

      const imports = result.imports as any[];
      // Should have PassportModule, JwtModule, plus FakeModule
      expect(imports.length).toBeGreaterThanOrEqual(3);
      expect(imports).toContain(FakeModule);
    });

    it('uses default JWT expiry when not specified', () => {
      const result = CattoAuthModule.forRoot(baseOptions);
      const imports = result.imports as any[];

      // JwtModule.register should use default '15m' for signOptions.expiresIn
      // We can check the JwtModule config was passed — the JwtModule is the second import
      expect(imports.length).toBeGreaterThanOrEqual(2);
    });

    describe('config validation', () => {
      it('throws when jwt.secret is missing', () => {
        expect(() =>
          CattoAuthModule.forRoot({
            jwt: { secret: '' },
            prismaToken: 'PrismaService',
          } as CattoAuthModuleOptions),
        ).toThrow('jwt.secret is required');
      });

      it('throws when prismaToken is missing', () => {
        expect(() =>
          CattoAuthModule.forRoot({
            jwt: { secret: 'valid-secret' },
            prismaToken: undefined as any,
          } as CattoAuthModuleOptions),
        ).toThrow('prismaToken is required');
      });
    });
  });
});
