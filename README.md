# angular-decorators [![Build Status](https://travis-ci.org/MikeRyan52/angular-decorators.svg?branch=master)](https://travis-ci.org/MikeRyan52/angular-decorators)

Angular 2, due to be released this year, offers a drastically different API for creating applications in comparison to Angular 1.x. angular-decorators provides annotations and utilities that allow you to write AngularJS 1.x apps in a similar way to this new API. By taking advantage of these annotations and utilities, porting your existing AngularJS 1.x apps to Angular 2 will be a quicker, less painful process.

## Installation via npm

`npm install angular-decorators --save-dev`

## Installation via jspm

`jspm install angular-decorators`

## Modules

The standard `angular.module` does not understand the meta data attached to your classes or functions from this library's annotations. As such, you must use the provided Module class to create Angular modules. Using it is very similar to `angular.module`:

```js
// Create a new module:
let myModule = Module('my-module', ['ui.bootrap', 'ui.router']);

// Reference a pre-existing module:
let otherModule = Module('my-module');
```

Registering an annotated component is easy:

```js
myModule.add(AnnotatedClass);
```

If you need to directly access the generated `angular.module`, just use the publish method:

```js
let angularModule = myModule.add(AnnotatedClass).publish();
```

Note: You do not need to publish a module to add it as a dependency to another module:

```js
let myModule = Module('my-module', []);
let otherModule = Module('other-module', [ myModule ]);
```

This works for traditional AngularJS modules and vice versa:
```js
let otherModule = angular.module('other-module', []);
let myModule = Module('my-module', [ otherModule ]);
let lastModule = angular.module('last-module', [ myModule.name ]);
```

## Annotations

The annotations provided in this package follow [this proposal](https://github.com/jonathandturner/brainstorming/blob/master/README.md). They work by adding meta information to your classes and functions under the `$component` and `$provider` namespaces. 

### Inject

The `@Inject` annotation provides a shorthand for adding the `$inject` property to your classes and functions. This is really convenient for classes as you can specify your injected dependencies on the constructor:

```js
class MyService{
	@Inject('$q', '$http')
	constructor($q, $http){

	}
}
```

becomes:

```js
function MyService($q, $http){
	
}

MyService.$inject = ['$q', '$http'];

```

### Component

The `@Component` annotation transforms a class into a directive, where the class becomes the directive's controller and the `controllerAs` property is the name of the class:

```js
let myModule = Module('my-component-module', []);

@Component({ 
	selector : 'my-component',
	bind : { 'myAttrA' : '=', 'myAttrB' : '&' }
})
@Template({ url : '/path/to/template.html' })
@Require('requiredComponent')
@Inject('$element', '$attrs')
class MyComponentCtrl{
	constructor($element, $attrs){

	}

	static link(scope, element, attrs, requiredComponent){

	}
}

myModule.add(MyComponentCtrl);
```

Becomes:

```js
function MyComponentCtrl($element, $attrs){
	
}

MyComponentCtrl.$inject = ['$element', '$attrs'];

MyComponentCtrl.link = function(scope, element, attrs, requiredComponent){

}

angular.module('my-component-module', [

])

.directive('myComponent', function(){
	return {
		restrict : 'E',
		controller : MyComponentCtrl,
		controllerAs : 'MyComponentCtrl',
		templateUrl : '/path/to/template.html',
		link: MyComponentCtrl.link,
		scope : {
			'myAttrA' : '=',
			'myAttrB' : '&'
		},
		bindToController: true
	};
});
```

##### Component Inheritance
One major benefit of structuring your components this way is that it now becomes much easier to extend components:

```js
@Component({ selector : 'animal', bind : { name : '@' } })
@Inject('$q')
class Animal{
	constructor($q){
		this.type = 'Animal';
		console.log(`${this.name} the ${this.type}`);
	}
}


@Component({ selector : 'frog' })
@Inject('RibbitFactory')
class Frog extends Animal{
	constructor($q, RibbitFactory){
		this.type = 'Frog';
		super($q);
	}
}
```

Then in your HTML:

```html
<frog name="Kermit"></frog>
```

Output: `Kermit the Frog`

##### About the Require Annotation
In AngularJS, when your directive requires multiple other directive controllers they are passed to your link function as an array:

```js
myModule.directive('myComponent', function(){
	return {
		require : ['^parent', 'sibling'],
		link : function(scope, element, attrs, controllers){
			var parent = controllers[0];
			var sibling = controllers[1];
		}
	};
});
```

As a convenience, when you use the `@Require` annotation your class is decorated with an `unpackRequires` method to make it easy to reference your required components:

```js
@Component({ selector : 'my-component' })
@Require('^parent', 'sibling')
class MyComponent{
	static link(scope, element, attrs, controllers){
		let {parent, sibling} = MyComponent.unpackRequires(controllers);
	}
}
```

### Decorator
The `@Decorator` annotation is identical to the `@Component` annotation, except you use `@Decorator` for directives that you want to restrict to a class or attribute:

```js
@Decorator({ selector : '[my-attr]' })
class MyAttrCtrl{
	constructor(){

	}
}

@Decorator({ selector : '.my-class' })
class MyClassCtrl{
	constructor(){

	}
}
```


### Service
The `@Service` annotation simply turns your class/function into a service:

```js
let myServiceModule = new Module('my-service');

@Service
class MyService{
	constructor(){

	}
}

myServiceModule.add(MyService);
```

becomes:

```js
var myServiceModule = angular.module('my-service', [

])

.service('MyService', function MyService(){
	
});

```

### Factory
The factory annotation is a complex annotation that assumes:

1. You have a class that requires parameters on instantiation
2. The parameters differ from injected AngularJS services

For example, if you had a class that looked like this:

```js
class Post{
	constructor($http, title, content){

	}
}
```

and you wanted to make a factory that created a `Post` with a provided title and content, you could do the following:

```js
@Factory('PostFactory')
@Inject('$http')
class Post{
	constructor($http, title, content){

	}
}
```

Then, in some other component you would be able to access the factory like this:

```js
@inject('PostFactory')
class NewPostService{
	constructor(PostFactory){
		let post = PostFactory('Title', 'Some content');
	}
}
```

If you want more control over the factory function, just add a static create method to your factory class:

```js
@Factory('CommentFactory')
@Inject('$http', '$q')
class Comment{
	constructor($http, $q, postID, comment){

	}

	static create(dependencies, post, comment){
		return new Comment(...dependencies, post.id, comment);
	}
}
```

## Adding Your Own Providers

Adding your own providers through annotations is very easy. To demonstrate, let's create a `@Route` annotation that lets you setup router configuration for Anguar 1.4's new router:

```js
// First we setup the Router annotation function:
export function Route(config){
	return function(target){
		target.$routeConfig = config;

		target.$provider = target.$provider || {};
		target.$provider.type = 'routeController';
		target.$provider.name = target.name;
	}
}

// Then we need to setup the parser:
import {Module} from 'angular-decorators';

Module.registerProvider('routeController', (provider, module) => {
	// Provider parsers accept the anotated provider class/function 
	// and the target angular module

	module.controller(provider.$provider.name, 
		['$router', ...provider.$inject, 
		function($router, ...dependencies){
			return new provider(...dependencies);
		}
	]);
});

// Now we can use our Router annotation:
@Route({ path : '/', component : 'home' })
@Inject('$q')
class HomeController{
	constructor($q){

	}
}
```
