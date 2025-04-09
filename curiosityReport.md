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
  dependency: GetString;
  constructor(dependency: GetString) {
    this.dependency = dependency;
  }

  getString() {
    return this.dependency.getString().toLowerCase();
  }
}

class B implements GetString {
  dependency: GetString;
  constructor(dependency: GetString) {
    this.dependency = dependency;
  }

  getString() {
    return `**${this.dependency.getString()}**`;
  }
}

class A implements GetString {
  dependency: GetString;
  constructor(dependency: GetString) {
    this.dependency = dependency;
  }

  getString() {
    return this.dependency.getString().split("").reverse().join("");
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

TODO

### InversifyJS

TODO

### Awilix

TODO