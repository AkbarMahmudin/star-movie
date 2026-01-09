// src/common/pipes/hash-password.pipe.ts
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  constructor(private readonly config: ConfigService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value?.password) return value;

    const saltRounds = this.config.get<number>('app.salt') || 10;

    // Hindari hashing jika sudah dalam bentuk hash
    const isHashed = /^\$2[aby]\$\d{2}\$.{53}$/.test(value.password);
    if (isHashed) return value;

    const hashed = await bcrypt.hash(value.password, saltRounds);
    return {
      ...value,
      password: hashed,
    };
  }
}
