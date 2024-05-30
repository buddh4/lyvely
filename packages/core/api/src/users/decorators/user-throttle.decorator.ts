export const USER_THROTTLER_TTL = 'USERTHROTTLER:TTL';
export const USER_THROTTLER_LIMIT = 'USERTHROTTLER:LIMIT';

function setThrottlerMetadata(target: any, limit: number, ttl: number): void {
  Reflect.defineMetadata(USER_THROTTLER_TTL, ttl, target);
  Reflect.defineMetadata(USER_THROTTLER_LIMIT, limit, target);
}

export const UserThrottle = (limit = 20, ttl = 60_000): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor) {
      setThrottlerMetadata(descriptor.value, limit, ttl);
      return descriptor;
    }
    setThrottlerMetadata(target, limit, ttl);
    return target;
  };
};
