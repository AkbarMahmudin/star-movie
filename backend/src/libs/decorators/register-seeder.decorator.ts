import { SeederRegistry } from '../../seed/seeders/seeder.registry';

export function RegisterSeeder() {
  return (target: any) => {
    SeederRegistry.register(target);
  };
}
