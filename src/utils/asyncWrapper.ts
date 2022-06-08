export const asyncWrapper = (callback: Function) => (req, res, next) => callback(req, res)
  .catch(next);
