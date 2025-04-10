# Dependency injection (DI)

Dependency injection is a principle where a class/method is passed its dependencies by the thing that creates it, rather than creating the dependencies from within the class/method. Here is some example code before and after refactoring to use dependency injection.

```typescript
// Without dependency injection

class Person {
  getName() {
    return "Evan";
  }
}

class Greeter {
  private person = new Person();

  greet() {
    return `Hello, ${this.person.getName()}!`;
  }
}

const greeter = new Greeter();
console.log(greeter.greet());
```

```typescript
// With dependency injection

class Person {
  getName() {
    return "Evan";
  }
}

class Greeter {
  private person: Person;

  constructor(person: Person) {
    this.person = person;
  }

  greet() {
    return `Hello, ${this.person.getName()}!`;
  }
}

const person = new Person();
const greeter = new Greeter(person);
console.log(greeter.greet());
```

## Why DI?

Initially dependency injection can make your code feel more complex, but it gives you a lot of advantages.

##### 1. It improves code reusability.
Since code doesn't define its own dependencies from within, you can easily pass in a different dependency that follows the same interface as the existing dependency. There is no need to duplicate or even change the code you stick the dependency into.

##### 2. It makes code more testable.
When testing code, you can easily choose to pass in mocked out dependencies into your code. That lets you test a class without testing its dependencies. It also means you can tell if methods on the dependency were called using mocks from a testing framework like jest.

##### 3. It improved code maintainability.
Because classes/methods don't know about their dependencies, it's easier to swap out dependencies without changing existing code. This helps keep changes isolated which improves maintainability.

## Inversion of control (IoC)

The inversion of control principle is a superset of dependency injection. With IoC, your code does not call itself. Instead your code is given to some other code which determines when it is run.

### IoC vs DI

This description of IoC sounds very similar to DI. However, they aren't the exact same. DI specifically refers to the type of IoC where you pass dependencies in as parameters, rather than creating them from within a class/method.

Things like callback functions and the template method pattern are both considered IoC, since they involve giving some other piece of code access to execute your code. However, they do not involve DI.

## Why use a framework for DI?

When I first heard about dependency injection, I learned about it in the context of a simple design principle of passing dependencies as parameters. It confused me to hear that there are frameworks to help you with this.

```typescript
interface GetString {
  getString: () => string;
}

class D implements GetString {
  getString() {
    return "Hello World";
  }
}

class C implements GetString {
  constructor(private d: GetString) {}

  getString() {
    return this.d.getString().toLowerCase();
  }
}

class B implements GetString {
  constructor(private c: GetString) {}

  getString() {
    return `**${this.c.getString()}**`;
  }
}

class A implements GetString {
  constructor(private b: GetString) {}

  getString() {
    return this.b.getString().split("").reverse().join("");
  }
}

const d = new D();
const c = new C(d);
const b = new B(c);
const a = new A(b);

console.log(a.getString());
```

Take this example of dependency injection that happens across 4 different classes. Each dependency must be created and passed into the next one. As applications get more complex, these dependencies could nest even further, or one class may need many dependencies. It becomes impractical to create all the dependencies from the outside and manage passing them all into each other every time you want to make a new instance of a method.

In addition, say one of these dependencies was something like a database connection. In that case we would want it to be a singleton, so that everything that used it would get the same database connection instance. We would have to manage not creating duplicate instances of the dependency, even as we pass it to many things that depend on it.

These are things that a DI framework helps manage automatically.

## DI JavaScript frameworks

There are many frameworks in JavaScript/TypeScript that help manage DI. Some larger frameworks such as NestJS and Angular have support for DI. Other frameworks are built just for handling DI. There are also a variety of frameworks in most other languages. DI is not language specific. However, for this report I'm focusing on TypeScript code.

### InversifyJS

[InversifyJS](https://inversify.io/) is one of the most popular frameworks for IoC and DI. Here is an example of the above code using Inversify.

```typescript
interface GetString {
  getString: () => string;
}

@injectable()
class D implements GetString {
  getString() {
    return "Hello World";
  }
}

@injectable()
class C implements GetString {
  constructor(@inject(D) private d: GetString) {}

  getString() {
    return this.d.getString().toLowerCase();
  }
}

@injectable()
class B implements GetString {
  constructor(@inject(C) private c: GetString) {}

  getString() {
    return `**${this.c.getString()}**`;
  }
}

@injectable()
class A implements GetString {
  constructor(@inject(B) private b: GetString) {}

  getString() {
    return this.b.getString().split("").reverse().join("");
  }
}

const container: Container = new Container();

container.bind(D).toSelf();
container.bind(C).toSelf();
container.bind(B).toSelf();
container.bind(A).toSelf();

console.log(container.get(A).getString());
```

In this simple example, it doesn't look any simpler than our previous code. However, if you have many interconnected dependencies it's nice to not have to manage passing each one to each other.

This framework uses decorators. I had forgotten that TypeScript had decorator syntax. It also uses property decorators, which is part of an experimental feature within TypeScript. This feature you get metadata about classes, methods, and properties at runtime. This lets the framework know what dependency should be injected in what place.

### Awilix

[Awilix](https://github.com/jeffijoe/awilix) is another DI framework for TypeScript. Like Inversify, it is also designed specifically for DI. However, it has slightly different syntax.

```typescript
interface GetString {
  getString: () => string;
}

class D implements GetString {
  getString() {
    return "Hello World";
  }
}

class C implements GetString {
  d: GetString;
  constructor({ d }: { d: GetString }) {
    this.d = d;
  }

  getString() {
    return this.d.getString().toLowerCase();
  }
}

class B implements GetString {
  c: GetString;
  constructor({ c }: { c: GetString }) {
    this.c = c;
  }

  getString() {
    return `**${this.c.getString()}**`;
  }
}

class A implements GetString {
  b: GetString;
  constructor({ b }: { b: GetString }) {
    this.b = b;
  }

  getString() {
    return this.b.getString().split("").reverse().join("");
  }
}

const container = createContainer();

container.register({
  d: asClass(D),
  c: asClass(C),
  b: asClass(B),
  a: asClass(A),
});

console.log(container.resolve("a").getString());
```

I think I like this framework more than Inversify because you don't need decorators on the classes and properties. I feel like this makes the code a lot cleaner, but it could lead to slightly more confusion about how the framework works.

## Drawbacks of DI

Dependency injection is a great principle, but it does have some drawbacks, especially when used with a framework.

* Even though it helps with code quality, DI can be confusing to read at first, especially when using a framework.
* DI frameworks can often be slow, and they may add overhead which can be especially costly for small projects.
* Some frameworks can make debugging difficult during runtime, as some will stick a proxy in front of your dependency. So it'll be harder to step through into code within a dependency as you usually would.