export const genAndClause = (columnValuesObj = {}) => {
    return Object.entries(columnValuesObj).reduce(
        (arr, [key, value]) => {
          let curr = `${key}='${value}'`;
          arr.push(curr);
          return arr;
        }
      , []).join(' AND ');
}

export const genSetClause = (modifyFieldsArray = []) => {
  return modifyFieldsArray.reduce(
      (arr, field, index) => {
        let curr = `${field}=$${index + 1}`;
        arr.push(curr);
        return arr;
      }
    , []).join(', ');
}

export const joinColumns = (columnsArray = []) => {
    return columnsArray.join(',');
}

export const genInsertValuesClause = (modifyFieldsArray) => {
  return modifyFieldsArray.reduce(
    (arr, field, index) => {
      let curr = `$${index + 1}`;
      arr.push(curr);
      return arr;
    }
  , []).join(', ');
}

export const buildValuesArray = (modelObj, modifyFieldsArray = []) => {
    //init return array
    let valuesArray = [];
    modifyFieldsArray.forEach((field) => {
      valuesArray.push(modelObj[field]);
    });

    return valuesArray;
}