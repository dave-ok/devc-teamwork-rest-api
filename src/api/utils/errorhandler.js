
const errorHandler = (err, req, res, next) => {  
  if (err.statusCode){
    res.status(err.statusCode).json({
      status: 'error',
      error: err.message
    });
  }
  else if (err.status){
    res.status(err.status).json({
      status: 'error',
      error: err.message
    });
  }
  else {
    res.status(500).json({
      status: 'error',
      error: 'Internal server error'
    });
  }  
  
};

export default errorHandler;
