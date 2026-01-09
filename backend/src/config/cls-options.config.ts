import { ClsModuleOptions } from 'nestjs-cls';
import { jwtDecode } from 'jwt-decode';

export const clsOptions: ClsModuleOptions = {
  global: true,
  middleware: {
    mount: true,
    setup(cls, req) {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return;
      }

      const token = authorization.split(' ')[1];
      const decode = jwtDecode(token);

      cls.set('currentUser', decode);
    },
  },
  guard: {},
  interceptor: {},
};
