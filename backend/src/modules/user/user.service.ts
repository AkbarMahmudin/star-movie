import { Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/base';

@Injectable()
export class UserService extends BaseService {
  protected defaultSearchBy = 'name';

  protected get modelName(): string {
    return 'User';
  }
}
