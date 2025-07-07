const ApiResponse = (req, res, next) => {
  res.success = (message, data, metadata = {}, links = {}) => {
    res.status(200).json({
      message,
      status: "success",
      data,
      metadata,
      links,
    });
  };

  res.error = (message, code = 400, details = {}) => {
    res.status(code).json({
      status: "error",
      error: {
        code,
        message,
        details,
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  };

  next();
};

module.exports = ApiResponse;
