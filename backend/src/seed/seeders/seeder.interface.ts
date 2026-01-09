export interface ISeeder {
  name: string;
  run(): Promise<void>;
}
