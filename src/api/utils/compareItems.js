export const isEqualTo = (item1, item2) => {
	return JSON.stringify(item1) == JSON.stringify(item2);
}

export const isSubset = (haystack, needle) => {
	return JSON.stringify(haystack).indexOf(JSON.stringify(needle)) >= 0;
}