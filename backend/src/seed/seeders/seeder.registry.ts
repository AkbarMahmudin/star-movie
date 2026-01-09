import { ISeeder } from './seeder.interface';

export class SeederRegistry {
  private static seeders: { new (...args: any[]): ISeeder }[] = [];

  static register(seeder: { new (...args: any[]): ISeeder }) {
    this.seeders.push(seeder);
  }

  static getSeeders(): { new (...args: any[]): ISeeder }[] {
    return this.seeders;
  }
}
