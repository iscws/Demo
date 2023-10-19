function myNew(origin, ...args) {
  let target = Object.create(origin.prototype);
  let returnValue = origin.apply(this, args);

  return returnValue instanceof Object ? returnValue : target;
}
