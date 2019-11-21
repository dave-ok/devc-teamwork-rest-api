export const isEqualTo = (item1, item2) => JSON.stringify(item1) === JSON.stringify(item2);

export const isSubset = (haystack, needle) => {
  const strHaystack = JSON.stringify(haystack);
  const strNeedle = JSON.stringify(needle);
  return strHaystack.indexOf(strNeedle) >= 0;
};
