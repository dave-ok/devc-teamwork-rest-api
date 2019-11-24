export const isEqualTo = (item1, item2) => {
  const str1 = JSON.stringify(item1).replace(/\n/g, '');
  const str2 = JSON.stringify(item2).replace(/\n/g, '');

  return str1 === str2;
};


export const isSubset = (haystack, needle) => {
  const strHaystack = JSON.stringify(haystack);
  const strNeedle = JSON.stringify(needle).slice(1, -1); // remove leading and trailing []

  return strHaystack.indexOf(strNeedle) >= 0;
};
