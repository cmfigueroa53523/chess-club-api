function toSnakeCase(str) {
  if(typeof str !== 'string') {
    throw new Error(`str must be a string. Recieved: ${typeof str}`);
  }
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export {
    toSnakeCase,
};
