<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <a href="http://www.prisma.io/" target="blank"><img src="https://cdn.freelogovectors.net/wp-content/uploads/2022/01/prisma_logo-freelogovectors.net_.png" height="200" alt="Prisma Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter with Prisma ORM repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migration

```bash
# generate new migration
$ npm run prisma:migrate:dev

# reset migration / run from 1st
$ npm run prisma:migrate:reset

# generate model
$ npm run prisma:generate
```

## Seeder

Seeder generator made use [nest-commander](https://nest-commander.jaymcdoniel.dev/en/introduction/intro/) for customize
cli application.

### Generate new seeder

```bash
$ npm run seed:generate <name>
```

Automatically the seeder file will be saved in `src/seed/seeders`

Example:

```typescript
// src/seed/seeders/user.seeder.ts

@RegisterSeeder()
@Injectable()
export class UserSeeder implements ISeeder {
  name = 'user';

  constructor(private readonly prisma: PrismaService) {
  }

  async run() {
    console.log('⏳  Seeding UserSeeder...');

    // TODO: Implement your seed logic

    console.log('✅  UserSeeder seeded.');
  }
}
```

### Running seeder

```bash
$ npm run seed
```

By default the above command will run all seeders. If you want to run a specific seeder, use the command:

```bash
$ npm run seed --module=<name> # name of seeder
# OR
$ npm run seed -m=<name>
```

## Service

When developing a feature, usually the business logic will be stored in a service. And generally the basic features of a
feature are `create`, `read`, `update` and `delete`. Base service will make it easier for developers to implement it
with inheritance.

```typescript

@Injectable()
export class UserService extends BaseService {
  protected defaultSearchBy = 'name'; // search key for find data

  // set to primary model
  protected get modelName() {
    return 'User';
  }
}
```
> Value of `modelName` is automatically set main model on `primaryModel`. You can see the parent class [here](src/shared/base/base.service.ts)

By default, the service class has created pagination in the data read process. If you want to create pagination in other
functions, you can use the static `pagination()` method from **BaseService**.

```typescript
import { BaseService } from '../../shared/base';
import { IResultPaginationOptions } from '../../common/interface';

@Injectable()
export class UserService extends BaseService {
  // ... other code
  findAllWithoutEmail(query: QueryFilter) {
    const paginateOptions: IResultPaginationOptions = BaseService.pagination(query);
    return this.primaryModel.findMany({
      select: { email: false },
      ...paginationOptions,
    });
  }
}
```

## Controller

In creating a controller, you can implement the `IBaseController` interface which contains the contract for all **CRUD**
methods.

```typescript

@Controller('users')
export class UserController implements IBaseController<CreateUserDto, UpdateUserDto, UserViewModel> {
  constructor(private readonly userService: UserService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<UserViewModel> {}

  @Get()
  @UseInterceptors(new PaginationInterceptor())
  async findAll(
    @Query() query: QueryFilter
  ): Promise<{ count: number; data: UserViewModel[] }> {}

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number | string
  ): Promise<UserViewModel> {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number | string) {}

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number | string,
    @Body() dto: UpdateUserDto
  ): Promise<UserViewModel> {}
}
```

> ⚠️ The interface contains only contract **CRUD** methods, **not including** supporting decorators.

> `PaginationInterceptor` will mapping & generate metadata for pagination

## Filter & Pagination

Sometimes you need specific criteria in fetching data. With static method `BaseService.pagination` and `QueryDto`, you
can easily do it through query string in url endpoint.

```bash
$ http://localhost:3000/users?search=jhon
# or more specific
$ http://localhost:3000/users?searchBy=email&search=jhon@example.com
```

There are various kinds of query params options that have been provided.

| Query params | Example                                                     | Default                                       | Description                               |
|--------------|-------------------------------------------------------------|-----------------------------------------------|-------------------------------------------|
| page         | `?page=3`                                                   | 1                                             | Get all data from page                    |
| limit        | `?limit=20`                                                 | 10                                            | Maximum data of one page                  |
| search       | `?search=jhon`                                              | none                                          | Searching data by keyword                 |
| searchBy     | `?searchBy=name` or <br/> `?searchBy=name&searchBy=email`   | Value from `defaultSearchBy` service property | Scope of searching based on column name   |
| rangeDate    | `?rangeDate=1-2-2025,5-2-2025` or <br/> `?rangeDate=2-2025` | none                                          | Filter by range date or month             |
| rangeDateBy  | `?rangeDateBy=publishedAt`                                  | createdAt                                     | Scope of filter date based on column name |
| order        | `?order=ASC`                                                | DESC                                          | Sorting data                              |
| orderBy      | `?orderBy=publishedAt`                                      | createdAt                                     | Scope of sorting based on column name     |

> ⚠️ The filtered data is based on the primary model that has been defined in the service. To get more specific data you
> need to improve your service using the available utilities.

## Authentication

This boilerplate has included module for authentication using JSON Web Token (JWT). This boilerplate includes a module for authentication using JWT. You can use the existing endpoint in [AuthController](src/shared/auth) or improve it.

### Guard

To protect your route, you can use the `JwtGuard` guard that has been provided.

Example:
```typescript
// guard all route
@UseGuards(JwtGuard)
@Controller('users')
export class UserController implements IBaseController<CreateUserDto, UpdateUserDto, UserViewModel>
{
  // ...
}

// guard on specific route
@Controller('users')
export class UserController implements IBaseController<CreateUserDto, UpdateUserDto, UserViewModel>
{
  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    // ...
  }
}

// or global no module
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
]
```
If you want to exclude guard on routes or implement RBAC & ACL, you can use decorator `@Public()`, `@Role()`, `@Permissions()`

Example:
```typescript
@Controller('users')
@UseGuards(JwtGuard)
export class UserController implements IBaseController<CreateUserDto, UpdateUserDto, UserViewModel> {
  @Public() // all user can use without authenticated
  @Post()
  async create() {
    // ...
  }

  @Role('admin') // only admin can use
  @Delete()
  async remove() {
    // ...
  }

  @Permissions('user:view')  // only user have permission can use
  @Get()
  async findAl() {
    // ...
  }
}
```
> You must register the access control list in the file [RolePermission](src/common/constants/role-permissions.constant.ts) or improve your guard strategy in [JwtGuard](src/shared/auth/guard/jwt.guard.ts)

### Get User Auth
To get the data of users who have logged in, you can use the following 3 methods.
#### 1. Cls Service
You can use the cls method provided by `BaseService` or inject it into your own **service**. Simply retrieve it with the `currentUser` key.

Example:
```typescript
export class UserService extends BaseService {
  // ...
  public profile() {
    return this.cls.get('currentUser');
  }
}

// OR

export class PostService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly cls?: ClsService,
  ) {}
  
  public create() {
    // ...
    const user = this.cls.get('currentUser');
    // ...
  }
}
```
#### 2. Decorator
If you want to implement it on the **controller** side, you can use a `decorator`.

Example:
```typescript
UseGuards(JwtGuard)
@Controller('users')
export class UserController
  implements IBaseController<CreateUserDto, UpdateUserDto, UserViewModel>
{
  //...
  @Get('profile')
  async profile(@CurrentUser() currentUser: User) {
    return UserViewModel.fromEntity(currentUser);
  }
}
```
#### 3. Helper
The two previous methods utilize tokens that are **decoded** in the middleware so that the user data in them is relatively **different** from the user data in the **database**. So, if you want to retrieve the most recent user login, use the `CurrentUser` helper service.

Example:

- ⚠️ Not recomended
```typescript
import { CurrentUser } from '../../libs/helpers';

export class UserService extends BaseService {
  // ...
  protected readonly currentUser: CurrentUser = new CurrentUser(this.prisma, this.cls);

  public async profile() {
    return this.currentUser.authenticated();
  }
}
```
- ✅ Recomended _(Dependency Injection)_
```typescript
import { CurrentUser } from '../../libs/helpers';

export class UserService extends BaseService {
    // ...
    constructor(
      protected readonly prisma: PrismaService,
      protected readonly cls: ClsService,
      protected readonly currentUser: CurrentUser,
    ) {
      super(prisma, cls);
    }
    
    public profile() {
      return this.currentUser.authenticated();
    }
}

// Don't forget provide on module
import { CurrentUser } from '../../libs/helpers';

@Module({
  // ...
  providers: [UserService, CurrentUser],
})
export class UserModule {}
```

## File Manager
This boilerplate includes a module for managing file requests, including `read`, `upload`, and `delete`. You can use the existing endpoints in [FileManagerController](src/shared/file-manager/file-manager.controller.ts) or customize them..

### Upload to Cloud
When you want to save a file to a bucket in the cloud such as Amazon S3, you can create a new service helper to handle it by implementing the `IUploadFile` interface.

Example:
```typescript
@Injectable()
export class S3UploadService implements IUploadFile {
  uploadFile(file: Express.Multer.File): Promise<IUploadFileResponse> {
    console.log('Sending to gcp storage...');

    // Logic upload to S3 bucket

    return Promise.resolve({
      filename: file.filename,
      size: file.size,
      originalname: file.originalname,
      url: `<to-bucket-storoage>/${file.path}`,
      extension: file.mimetype,
    });
  }
}
```
After creating the service helper call it into the [FileManagerModule](src/shared/file-manager/file-manager.module.ts)

Example:
```typescript
@Module({
  // ...
  providers: [
    FileManagerService,
    LocalUploadService,
    S3UploadService,
    {
      provide: UPLOAD_HANDLER,
      // useClass: LocalUploadService, // delete default
      useClass: S3UploadService,
    },
  ],
})
export class FileManagerModule {}
```
## Stay in touch

- Author - [Akbar M](https://github.com/akbarmahmudin)


