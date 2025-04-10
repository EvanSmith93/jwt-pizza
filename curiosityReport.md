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

TODO

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
Take this example of dependency injection that happens across 4 different classes. Each dependency must be created and passed into the next one. As applications get more complex, these dependencies could nest even further, or one class may need many dependencies. It becomes impractical to create all the dependencies from the outside and manage passing them all into each other.

In addition, say one of these dependencies was something like a database connection. In that case we would want it to be a singleton, so that everything that used it would get the same database connection instance. We would have to manage not creating duplicate instances of the dependency, even as we pass it to many things that depend on it.

These are things that a DI framework helps manage automatically.

## DI JavaScript frameworks

There are many frameworks that help manage DI. Some larger frameworks such as NestJS and Angular have support for DI. Other frameworks are built just for handling DI.

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

In this simple example, it doesn't look simpler. However, if you have many interconnected dependencies it's nice to not have to manage passing each one to each other. 

This framework uses decorators. I had forgotten that TypeScript had decorator syntax. It also uses property decorators, which is part of an experimental feature within TypeScript. This feature you get metadata about classes, methods, and properties at runtime. This lets the framework know what dependency should be injected in what place.

### Awilix

TODO