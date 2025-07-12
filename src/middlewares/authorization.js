const authorize = (permission) => {
  return async (req, res, next) => {
    if (!permission) return next();

    const role = await req.role;
    const permissions = await req.permissions;

    const hasPermission = permissions.find(
      (per) => per.username === permission
    );

    if (hasPermission) {
      next();
    } else {
      return res.error("Invalid Request");
    }
  };
};

module.exports = { authorize };
