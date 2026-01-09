export interface ICacheManager {
  set(key: string, value: string, ttl?: Date): void | any;

  delete(key: string): void | any;

  get(key: string): any;
}
