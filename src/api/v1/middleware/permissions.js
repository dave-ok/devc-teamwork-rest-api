import jwtPermissions from 'express-jwt-permissions';

// search object for key and value
const searchObject = (obj, searchKey, searchVal) => {
  let isMatched = false;
  let value = '';

  for (let i = 0; i < Object.keys(obj).length; i += 1) {
    const outerkey = Object.keys(obj)[i];
    if (new RegExp(outerkey, 'gi').test(searchKey)) {
      for (let j = 0; j < Object.keys(obj[outerkey]).length; j += 1) {
        const innerkey = Object.keys(obj[outerkey])[j];
        if (new RegExp(innerkey, 'i').test(searchVal)) {
          value = obj[outerkey][innerkey];
          isMatched = true;
          break;
        }
      }
      if (isMatched) break;
    }
  }
  return value;
};

// initialize permissions middleware
const jwtPerm = jwtPermissions();

export default (routePerms) => (req, res, next) => {
  // check if requested path and method requires certain permissions to access it
  // the * is for wildcard methods i.e all methods
/*   const routeHasPermissions = Object.prototype.hasOwnProperty.call(routePerms, req.originalUrl)
      && (Object.prototype.hasOwnProperty.call(routePerms[req.originalUrl], req.method)
      || Object.prototype.hasOwnProperty.call(routePerms[req.originalUrl], '*')); */

  const routePermissions = searchObject(routePerms, req.originalUrl, req.method);

  if (routePermissions !== '') {
    // check current user's permission and store middleware
    // routePerms[req.originalUrl][req.method]
    const jwtPermMW = jwtPerm.check(routePermissions);

    // return middleware
    return jwtPermMW(req, res, next);
  }

  // no permissions needed, go to next middleware
  return next();
};
