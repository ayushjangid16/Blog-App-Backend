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

const isSystemUser = async (req, res, next) => {
  if (req.user.user_type === "system_user") {
    return res.error("Invalid Request");
  }

  next();
};

module.exports = { authorize, isSystemUser };
