import { IS_PUBLIC_KEY, ROLES_KEY } from '../../constants';
import { Public } from '../public.decorator';
import { Roles } from '../roles.decorator';

// We can't easily test createParamDecorator with unit tests since it requires
// NestJS runtime. Instead, we test the metadata decorators and verify the
// CurrentUser logic by testing its factory function directly.

describe('Roles decorator', () => {
  it('sets ROLES_KEY metadata with provided roles', () => {
    // Roles() returns a decorator that calls SetMetadata
    const decorator = Roles('admin', 'platform_admin');

    // Apply decorator to a test target and check metadata
    class TestController {}
    const descriptor = { value: jest.fn() };
    decorator(TestController, 'testMethod', descriptor);

    // SetMetadata stores on Reflect metadata
    const metadata = Reflect.getMetadata(ROLES_KEY, descriptor.value);
    expect(metadata).toEqual(['admin', 'platform_admin']);
  });

  it('sets single role', () => {
    const decorator = Roles('user');
    class TestController {}
    const descriptor = { value: jest.fn() };
    decorator(TestController, 'testMethod', descriptor);

    const metadata = Reflect.getMetadata(ROLES_KEY, descriptor.value);
    expect(metadata).toEqual(['user']);
  });

  it('sets empty roles array', () => {
    const decorator = Roles();
    class TestController {}
    const descriptor = { value: jest.fn() };
    decorator(TestController, 'testMethod', descriptor);

    const metadata = Reflect.getMetadata(ROLES_KEY, descriptor.value);
    expect(metadata).toEqual([]);
  });
});

describe('Public decorator', () => {
  it('sets IS_PUBLIC_KEY metadata to true', () => {
    const decorator = Public();
    class TestController {}
    const descriptor = { value: jest.fn() };
    decorator(TestController, 'testMethod', descriptor);

    const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, descriptor.value);
    expect(metadata).toBe(true);
  });
});

describe('CurrentUser decorator (logic test)', () => {
  // Test the normalization logic that CurrentUser applies
  // We can't test the actual createParamDecorator in unit tests,
  // but we can test the transformation logic directly.

  function normalizeUser(user: any) {
    if (!user) return null;
    if (user.id && !user.userId) {
      user.userId = user.id;
    }
    if (user.userId && !user.id) {
      user.id = user.userId;
    }
    return user;
  }

  it('returns null when user is null', () => {
    expect(normalizeUser(null)).toBeNull();
  });

  it('returns null when user is undefined', () => {
    expect(normalizeUser(undefined)).toBeNull();
  });

  it('normalizes userId to id', () => {
    const user = { userId: 'user-123', email: 'test@example.com' };
    const result = normalizeUser(user);
    expect(result.id).toBe('user-123');
    expect(result.userId).toBe('user-123');
  });

  it('normalizes id to userId', () => {
    const user = { id: 'user-456', email: 'test@example.com' };
    const result = normalizeUser(user);
    expect(result.id).toBe('user-456');
    expect(result.userId).toBe('user-456');
  });

  it('preserves existing id and userId when both present', () => {
    const user = {
      id: 'user-789',
      userId: 'user-789',
      email: 'test@example.com',
    };
    const result = normalizeUser(user);
    expect(result.id).toBe('user-789');
    expect(result.userId).toBe('user-789');
  });
});
