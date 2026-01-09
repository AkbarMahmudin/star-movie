import { Command, CommandRunner } from 'nest-commander';
import { promises as fs, existsSync, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

@Command({
  name: 'generate-seeder',
  description: 'Generate new seeder file with boilerplate',
})
export class GenerateSeederCommand extends CommandRunner {
  async run(passedParams: string[]): Promise<void> {
    const [name] = passedParams;

    if (!name) {
      console.error('❌ Seeder name is required!');
      return;
    }

    const className = this.toPascalCase(name) + 'Seeder';
    const fileName = `${name}.seeder.ts`;
    const filePath = path.join(__dirname, 'seeders', fileName);
    const templatePath = path.join(__dirname, 'template', 'seeder.txt');
    const indexPath = path.join(__dirname, '..', 'seed', 'seeders', 'index.ts');

    try {
      const template = await fs.readFile(templatePath, 'utf-8');
      const content = template
        .replace(/{{className}}/g, className)
        .replace(/{{name}}/g, name);

      await fs.writeFile(filePath, content);
      console.log(`✅ Seeder created at src/seed/seeders/${fileName}`);

      this.appendToIndex(name, indexPath);
    } catch (err) {
      console.error('❌ Error generating seeder:', err.message);
    }
  }

  private toPascalCase(str: string) {
    return str.replace(/(^\w|-\w)/g, (m) => m.replace('-', '').toUpperCase());
  }

  private appendToIndex(name: string, indexPath: string) {
    const importPath = `./${name}.seeder`;

    let indexContent = '';
    if (existsSync(indexPath)) {
      indexContent = readFileSync(indexPath, 'utf-8');
    }

    const importLine = `import '${importPath}';`;

    if (!indexContent.includes(importLine)) {
      indexContent += `${importLine}\n`;
      writeFileSync(indexPath, indexContent);
      console.log(`✅ Registered in src/seed/seeders/index.ts`);
    } else {
      console.log(`⚠️ Seeder already registered in src/seed/seeders/index.ts`);
    }
  }
}
