

const gobalErrorHander = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message,
    // errorStack: config.env === "development" ? err.stack : "",
  });
};

export default gobalErrorHander;
