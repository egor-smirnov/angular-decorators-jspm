'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.parseComponentSelector = parseComponentSelector;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function parseComponentSelector(selector) {
	var selectorArray = undefined;
	var type = undefined;

	if (selector.match(/\[(.*?)\]/) !== null) {
		selectorArray = selector.slice(1, selector.length - 1).split('-');
		type = 'A';
	} else if (selector[0] === '.') {
		selectorArray = selector.slice(1, selector.length).split('-');
		type = 'C';
	} else {
		selectorArray = selector.split('-');
		type = 'E';
	}

	var first = selectorArray.shift();
	var name = undefined;

	if (selectorArray.length > 0) {
		for (var i = 0; i < selectorArray.length; i++) {
			var s = selectorArray[i];
			s = s.slice(0, 1).toUpperCase() + s.slice(1, s.length);
			selectorArray[i] = s;
		}

		name = [first].concat(_toConsumableArray(selectorArray)).join('');
	} else {
		name = first;
	}

	return { name: name, type: type };
}