import { Command, CommandRunner, Option } from 'nest-commander';
import { Inject } from '@nestjs/common';
import { ISeeder } from './seeders/seeder.interface';

@Command({
  name: 'seed',
  description: 'Seed database with initial data',
})
export class SeedCommand extends CommandRunner {
  constructor(
    @Inject('SEEDERS') private readonly seeders: ISeeder[], // 👈 inject array of seeders
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options: { module?: string; env?: string },
  ) {
    const { module: selectedModule, env } = options;

    if (env) {
      process.env.NODE_ENV = env;
      console.log(`🌐 Environment set to: ${env}`);
    }

    const seedersToRun = selectedModule
      ? this.seeders.filter((s) => s.name === selectedModule)
      : this.seeders;

    if (seedersToRun.length === 0) {
      console.warn('⚠️  No seeders found for the specified module.');
      return;
    }

    for (const seeder of seedersToRun) {
      console.log(`🚀 Running ${seeder.name} seeder...`);
      await seeder.run();
    }

    console.log('✅ All specified seeders completed.');
  }

  @Option({
    flags: '-m, --module [module]',
    description: 'Specify a specific seeder to run',
  })
  parseModule(val: string): string {
    return val?.toLowerCase();
  }

  @Option({
    flags: '-e, --env [env]',
    description: 'Specify environment',
  })
  parseEnv(val: string): string {
    return val;
  }
}
