export const isEqualTo = (item1, item2) => {
  //dummy line
  return JSON.stringify(item1).replace(/\n/g, '') === JSON.stringify(item2).replace(/\n/g, '');
}

export const isSubset = (haystack, needle) => {
  let strHaystack = JSON.stringify(haystack);
  let strNeedle = JSON.stringify(needle).slice(1, -1); //remove leading and trailing []

  return strHaystack.indexOf(strNeedle) >= 0;
};
