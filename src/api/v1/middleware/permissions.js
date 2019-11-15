import jwtPermissions from 'express-jwt-permissions';

// initialize permissions middleware
const jwtPerm = jwtPermissions();

export default (routePerms) => (req, res, next) => {
  // check if requested path and method requires certain permissions to access it
  // the * is for wildcard methods i.e all methods
  const routeHasPermissions = Object.prototype.hasOwnProperty.call(routePerms, req.originalUrl)
      && (Object.prototype.hasOwnProperty.call(routePerms[req.originalUrl], req.method)
      || Object.prototype.hasOwnProperty.call(routePerms[req.originalUrl], '*'));

  if (routeHasPermissions) {
    // check current user's permission and store middleware
    const jwtPermMW = jwtPerm.check(routePerms[req.originalUrl][req.method]);

    // return middleware
    return jwtPermMW(req, res, next);
  }

  // no permissions needed, go to next middleware
  return next();
};
