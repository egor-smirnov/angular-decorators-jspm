'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _parsers = {};

var DecoratedModule = (function () {
	function DecoratedModule(name) {
		var modules = arguments[1] === undefined ? false : arguments[1];

		_classCallCheck(this, DecoratedModule);

		this.name = name;
		this.moduleList(modules);

		if (modules) {
			this._module = angular.module(name, this._dependencies);
		} else {
			this._module = angular.module(name);
		}
	}

	_createClass(DecoratedModule, [{
		key: 'add',
		value: function add() {
			for (var _len = arguments.length, providers = Array(_len), _key = 0; _key < _len; _key++) {
				providers[_key] = arguments[_key];
			}

			for (var i = 0; i < providers.length; i++) {
				var parser = _parsers[providers[i].$provider.type];

				parser(providers[i], this._module);
			}

			return this;
		}
	}, {
		key: 'bootstrap',
		value: function bootstrap() {
			if (!this.bundled) this.bundle();
		}
	}, {
		key: 'publish',
		value: function publish() {
			return this._module;
		}
	}, {
		key: 'moduleList',
		value: function moduleList(modules) {
			this._dependencies = [];

			if (modules && modules.length !== 0) {
				for (var i = 0; i < modules.length; i++) {
					if (modules[i] && modules[i].name) {
						this._dependencies.push(modules[i].name);
					} else if (typeof modules[i] === 'string') {
						this._dependencies.push(modules[i]);
					} else {
						throw new Error('Cannot read module: Unknown module in ' + this.name);
					}
				}
			}
		}
	}]);

	return DecoratedModule;
})();

function Module() {
	for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		params[_key2] = arguments[_key2];
	}

	return new (_bind.apply(DecoratedModule, [null].concat(params)))();
}

Module.registerProvider = function (providerType, parser) {
	_parsers[providerType] = parser;
};

Module.getParser = function (providerType) {
	return _parsers[providerType];
};

exports.Module = Module;