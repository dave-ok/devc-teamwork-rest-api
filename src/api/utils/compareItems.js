const compareArrayObjects = (subset, mainset, isToplevel) => {

	// Get the subset type
	var type = Object.prototype.toString.call(subset);

	// If the two objects are not the same type, return false
	if (type !== Object.prototype.toString.call(mainset)) return false;

	// If items are not an object or array, return false
	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

	// Compare the length of the length of the two items
	var subsetLen = type === '[object Array]' ? subset.length : Object.keys(subset).length;
	var mainsetLen = type === '[object Array]' ? mainset.length : Object.keys(mainset).length;

	// only skip check top level of array so dat we can reuse this function for subsets
	if (!isToplevel) {
		if (subsetLen !== mainsetLen) return false;
	}
	
	// Compare two items
	var compare = function (item1, item2) {

		// Get the object type
		var itemType = Object.prototype.toString.call(item1);

		// If an object or array, compare recursively
		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
			if (!isEqual(item1, item2)) return false;
		}

		// Otherwise, do a simple comparison
		else {

			// If the two items are not the same type, return false
			if (itemType !== Object.prototype.toString.call(item2)) return false;

			// Else if it's a function, convert to a string and compare
			// Otherwise, just compare
			if (itemType === '[object Function]') {
				if (item1.toString() !== item2.toString()) return false;
			} else {
				if (item1 !== item2) return false;
			}

		}
	};

	// Compare properties
	if (type === '[object Array]') {
		for (var i = 0; i < subsetLen; i++) {
			if (compare(subset[i], mainset[i]) === false) return false;
		}
	} else {
		for (var key in subset) {
			if (subset.hasOwnProperty(key)) {
				if (compare(subset[key], mainset[key]) === false) return false;
			}
		}
	}

	// If nothing failed, return true
	return true;

};