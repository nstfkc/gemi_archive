export function wrap<T, U>(fn: (...args: T[]) => Promise<U>) {
  return async (...args: T[]) => {
    const result = await fn(...args);
    return result;
  };
}

export function wrapMutation<T, U>(fn: (...args: T[]) => Promise<U>) {
  return async (...args: T[]) => {
    const result = await fn(...args);
    return result;
  };
}

export class BaseModel {}
