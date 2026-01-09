export function softDeleteMiddleware() {
  return async (params, next) => {
    // Intercept delete operations
    if (params.action === 'delete') {
      // Change action to update
      params.action = 'update';
      params.args['data'] = { deletedAt: new Date() };
    }

    // Intercept deleteMany
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      if (!params.args.data) {
        params.args['data'] = {};
      }
      params.args.data['deletedAt'] = new Date();
    }

    return next(params);
  };
}
