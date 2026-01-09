export function excludeSoftDeletedMiddleware() {
  return async (params, next) => {
    if (
      ![
        'create',
        'createMany',
        'delete',
        'deleteMany',
        'update',
        'updateMany',
      ].includes(params.action)
    ) {
      if (!params.args) {
        params.args = {};
      }
      if (!params.args.where) {
        params.args.where = {};
      }
      // Tambahkan filter deletedAt IS NULL
      params.args.where['deletedAt'] = null;
    }

    return next(params);
  };
}
