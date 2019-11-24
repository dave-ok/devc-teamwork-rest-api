export const genAndClause = (columnValuesObj = {}) => Object.entries(columnValuesObj).reduce(
  (arr, [key, value]) => {
    const curr = `${key}='${value}'`;
    arr.push(curr);
    return arr;
  },
  [],
).join(' AND ');

export const genSetClause = (modifyFieldsArray = []) => modifyFieldsArray.reduce(
  (arr, field, index) => {
    const curr = `${field}=$${index + 1}`;
    arr.push(curr);
    return arr;
  },
  [],
).join(', ');

export const joinColumns = (columnsArray = []) => columnsArray.join(',');

export const genInsertValuesClause = (modifyFieldsArray) => modifyFieldsArray.reduce(
  (arr, field, index) => {
    const curr = `$${index + 1}`;
    arr.push(curr);
    return arr;
  },
  [],
).join(', ');

export const buildValuesArray = (modelObj, modifyFieldsArray = []) => {
  // init return array
  const valuesArray = [];
  modifyFieldsArray.forEach((field) => {
    valuesArray.push(modelObj[field]);
  });

  return valuesArray;
};
