import {Module} from '../module/module';
import annotate from './annotate';

export function decorateDirective(t, name, restrict, scope, controllerAs){
	annotate(t, '$provider', {
		name,
		type : 'directive'
	});

	annotate(t, '$component', { restrict });

	if(scope){
		annotate(t, '$component', { bindToController : true });

		if(scope === 'createChildScope') {
			annotate(t.$component, 'scope', true);
		} else {
			annotate(t.$component, 'scope', scope);
		}
	}
	
	if(controllerAs) {
		annotate(t.$component, 'controllerAs', controllerAs);
	}
}

Module.registerProvider('directive', (provider, module) => {
	let name = provider.$provider.name;
	let controller = provider;
	let component = controller.$component;
	delete controller.$component;

	component.controllerAs = component.controllerAs || controller.name;
	component.controller = controller;
	component.link = provider.link;
	component.compile = provider.compile;

	module.directive(name, function(){
		return component;
	});
});
