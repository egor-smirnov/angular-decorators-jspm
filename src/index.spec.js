import chai from './util/tests';
import {
	Component,
	Controller,
	Decorator,
	Factory,
	Inject,
	Provider,
	Require,
	Service,
	View,
	Transclude,
	Module
} from './index';

describe('Angular Decorators', function(){
	it('should export Component', () => Component.should.be.defined );
	it('should export Controller', () => Controller.should.be.defined );
	it('should export Decorator', () => Decorator.should.be.defined );
	it('should export Factory', () => Factory.should.be.defined );
	it('should export Inject', () => Inject.should.be.defined );
	it('should export Provider', () => Provider.should.be.defined);
	it('should export Require', () => Require.should.be.defined );
	it('should export Service', () => Service.should.be.defined );
	it('should export View', () => View.should.be.defined );
	it('should export Transclude', () => Transclude.should.be.defined );
	it('should export Module', () => Module.should.be.defined );
});