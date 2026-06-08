# Variable scope, closure

JavaScript is a very function-oriented language. It gives us a lot of freedom. A  function can be created at any moment, passed as an argument to another  function, and then called from a totally different place of code later.

We already know that a function can access variables outside of it (“outer” variables).

But what happens if outer variables change since a function is created? Will the function get newer values or the old ones?

And what if a function is passed along as an argument and called from another place of code, will it get access to outer variables at the new place?

Let’s expand our knowledge to understand these scenarios and more complex ones.

We’ll talk about `let/const` variables here

In JavaScript, there are 3 ways to declare a variable: `let`, `const` (the modern ones), and `var` (the remnant of the past).

- In this article we’ll use `let` variables in examples.
- Variables, declared with `const`, behave the same, so this article is about `const` too.
- The old `var` has some notable differences, they will be covered in the article [The old "var"](https://javascript.info/var).

## [Code blocks](https://javascript.info/closure#code-blocks)

If a variable is declared inside a code block `{...}`, it’s only visible inside that block.

For example:

​                      

​                      

```javascript
{
  // do some job with local variables that should not be seen outside

  let message = "Hello"; // only visible in this block

  alert(message); // Hello
}

alert(message); // Error: message is not defined
```

We can use this to isolate a piece of code that does its own task, with variables that only belong to it:

​                      

​                      

```javascript
{
  // show message
  let message = "Hello";
  alert(message);
}

{
  // show another message
  let message = "Goodbye";
  alert(message);
}
```

There’d be an error without blocks

Please note, without separate blocks there would be an error, if we use `let` with the existing variable name:

​                      

​                      

```javascript
// show message
let message = "Hello";
alert(message);

// show another message
let message = "Goodbye"; // Error: variable already declared
alert(message);
```

For `if`, `for`, `while` and so on, variables declared in `{...}` are also only visible inside:

​                      

​                      

```javascript
if (true) {
  let phrase = "Hello!";

  alert(phrase); // Hello!
}

alert(phrase); // Error, no such variable!
```

Here, after `if` finishes, the `alert` below won’t see the `phrase`, hence the error.

That’s great, as it allows us to create block-local variables, specific to an `if` branch.

The similar thing holds true for `for` and `while` loops:

​                      

​                      

```javascript
for (let i = 0; i < 3; i++) {
  // the variable i is only visible inside this for
  alert(i); // 0, then 1, then 2
}

alert(i); // Error, no such variable
```

Visually, `let i` is outside of `{...}`. But the `for` construct is special here: the variable, declared inside it, is considered a part of the block.

## [Nested functions](https://javascript.info/closure#nested-functions)

A function is called “nested” when it is created inside another function.

It is easily possible to do this with JavaScript.

We can use it to organize our code, like this:

```javascript
function sayHiBye(firstName, lastName) {

  // helper nested function to use below
  function getFullName() {
    return firstName + " " + lastName;
  }

  alert( "Hello, " + getFullName() );
  alert( "Bye, " + getFullName() );

}
```

Here the *nested* function `getFullName()` is made for convenience. It can access the outer variables and so can  return the full name. Nested functions are quite common in JavaScript.

What’s much more interesting, a nested function can be returned:  either as a property of a new object or as a result by itself. It can  then be used somewhere else. No matter where, it still has access to the same outer variables.

Below, `makeCounter` creates the “counter” function that returns the next number on each invocation:

​                      

​                      

```javascript
function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1
alert( counter() ); // 2
```

Despite being simple, slightly modified variants of that code have practical uses, for instance, as a [random number generator](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) to generate random values for automated tests.

How does this work? If we create multiple counters, will they be independent? What’s going on with the variables here?

Understanding such things is great for the overall knowledge of  JavaScript and beneficial for more complex scenarios. So let’s go a bit  in-depth.

## [Lexical Environment](https://javascript.info/closure#lexical-environment)

Here be dragons!

The in-depth technical explanation lies ahead.

As far as I’d like to avoid low-level language details, any  understanding without them would be lacking and incomplete, so get  ready.

For clarity, the explanation is split into multiple steps.

### [Step 1. Variables](https://javascript.info/closure#step-1-variables)

In JavaScript, every running function, code block `{...}`, and the script as a whole have an internal (hidden) associated object known as the *Lexical Environment*.

The Lexical Environment object consists of two parts:

1. *Environment Record* – an object that stores all local variables as its properties (and some other information like the value of `this`).
2. A reference to the *outer lexical environment*, the one associated with the outer code.

**A “variable” is just a property of the special internal object, `Environment Record`. “To get or change a variable” means “to get or change a property of that object”.**

In this simple code without functions, there is only one Lexical Environment:

![image-20260608131244598](/home/guru/.config/Typora/typora-user-images/image-20260608131244598.png)

This is the so-called *global* Lexical Environment, associated with the whole script.

On the picture above, the rectangle means Environment Record  (variable store) and the arrow means the outer reference. The global  Lexical Environment has no outer reference, that’s why the arrow points  to `null`.

As the code starts executing and goes on, the Lexical Environment changes.

Here’s a little bit longer code:

![image-20260608131310049](/home/guru/.config/Typora/typora-user-images/image-20260608131310049.png)

Rectangles on the right-hand side demonstrate how the global Lexical Environment changes during the execution:

1. When the script starts, the Lexical Environment is pre-populated with all declared variables.
   - Initially, they are in the “Uninitialized” state. That’s a special  internal state, it means that the engine knows about the variable, but  it cannot be referenced until it has been declared with `let`. It’s almost the same as if the variable didn’t exist.
2. Then `let phrase` definition appears. There’s no assignment yet, so its value is `undefined`. We can use the variable from this point forward.
3. `phrase` is assigned a value.
4. `phrase` changes the value.

Everything looks simple for now, right?

- A variable is a property of a special internal object, associated with the currently executing block/function/script.
- Working with variables is actually working with the properties of that object.

Lexical Environment is a specification object

“Lexical Environment” is a specification object: it only exists “theoretically” in the [language specification](https://tc39.es/ecma262/#sec-lexical-environments) to describe how things work. We can’t get this object in our code and manipulate it directly.

JavaScript engines also may optimize it, discard variables that are  unused to save memory and perform other internal tricks, as long as the  visible behavior remains as described.

### [Step 2. Function Declarations](https://javascript.info/closure#step-2-function-declarations)

A function is also a value, like a variable.

**The difference is that a Function Declaration is instantly fully initialized.**

When a Lexical Environment is created, a Function Declaration immediately becomes a ready-to-use function (unlike `let`, that is unusable till the declaration).

That’s why we can use a function, declared as Function Declaration, even before the declaration itself.

For example, here’s the initial state of the global Lexical Environment when we add a function:

![image-20260608131343412](/home/guru/.config/Typora/typora-user-images/image-20260608131343412.png)

Naturally, this behavior only applies to  Function Declarations, not Function Expressions where we assign a  function to a variable, such as `let say = function(name)...`.

### [Step 3. Inner and outer Lexical Environment](https://javascript.info/closure#step-3-inner-and-outer-lexical-environment)

When a function runs, at the beginning of the call, a new Lexical  Environment is created automatically to store local variables and  parameters of the call.

For instance, for `say("John")`, it looks like this (the execution is at the line, labelled with an arrow):

![image-20260608131405241](/home/guru/.config/Typora/typora-user-images/image-20260608131405241.png)

During the function call we have two Lexical Environments: the inner one (for the function call) and the outer one (global):

- The inner Lexical Environment corresponds to the current execution of `say`. It has a single property: `name`, the function argument. We called `say("John")`, so the value of the `name` is `"John"`.
- The outer Lexical Environment is the global Lexical Environment. It has the `phrase` variable and the function itself.

The inner Lexical Environment has a reference to the `outer` one.

**When the code wants to access a variable – the inner Lexical  Environment is searched first, then the outer one, then the more outer  one and so on until the global one.**

If a variable is not found anywhere, that’s an error in strict mode (without `use strict`, an assignment to a non-existing variable creates a new global variable, for compatibility with old code).

In this example the search proceeds as follows:

- For the `name` variable, the `alert` inside `say` finds it immediately in the inner Lexical Environment.

- When it wants to access `phrase`, then there is no `phrase` locally, so it follows the reference to the outer Lexical Environment and finds it there.

  ![image-20260608131433763](/home/guru/.config/Typora/typora-user-images/image-20260608131433763.png)

### [Step 4. Returning a function](https://javascript.info/closure#step-4-returning-a-function)

Let’s return to the `makeCounter` example.

```javascript
function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();
```

At the beginning of each `makeCounter()` call, a new Lexical Environment object is created, to store variables for this `makeCounter` run.

So we have two nested Lexical Environments, just like in the example above:

![image-20260608131450637](/home/guru/.config/Typora/typora-user-images/image-20260608131450637.png)

What’s different is that, during the execution of `makeCounter()`, a tiny nested function is created of only one line: `return count++`. We don’t run it yet, only create.

All functions remember the Lexical Environment in which they were  made. Technically, there’s no magic here: all functions have the hidden  property named `[[Environment]]`, that keeps the reference to the Lexical Environment where the function was created:

![image-20260608131507838](/home/guru/.config/Typora/typora-user-images/image-20260608131507838.png)

So, `counter.[[Environment]]` has the reference to `{count: 0}` Lexical Environment. That’s how the function remembers where it was created, no matter where it’s called. The `[[Environment]]` reference is set once and forever at function creation time.

Later, when `counter()` is called, a new Lexical Environment is created for the call, and its outer Lexical Environment reference is taken from `counter.[[Environment]]`:

![image-20260608131519114](/home/guru/.config/Typora/typora-user-images/image-20260608131519114.png)

Now when the code inside `counter()` looks for `count` variable, it first searches its own Lexical Environment (empty, as  there are no local variables there), then the Lexical Environment of the outer `makeCounter()` call, where it finds and changes it.

**A variable is updated in the Lexical Environment where it lives.**

Here’s the state after the execution:

![image-20260608131533515](/home/guru/.config/Typora/typora-user-images/image-20260608131533515.png)w

If we call `counter()` multiple times, the `count` variable will be increased to `2`, `3` and so on, at the same place.

Closure

There is a general programming term “closure”, that developers generally should know.

A [closure](https://en.wikipedia.org/wiki/Closure_(computer_programming)) is a function that remembers its outer variables and can access them.  In some languages, that’s not possible, or a function should be written  in a special way to make it happen. But as explained above, in  JavaScript, all functions are naturally closures (there is only one  exception, to be covered in [The "new Function" syntax](https://javascript.info/new-function)).

That is: they automatically remember where they were created using a hidden `[[Environment]]` property, and then their code can access outer variables.

When on an interview, a frontend developer gets a question about  “what’s a closure?”, a valid answer would be a definition of the closure and an explanation that all functions in JavaScript are closures, and  maybe a few more words about technical details: the `[[Environment]]` property and how Lexical Environments work.

## [Garbage collection](https://javascript.info/closure#garbage-collection)

Usually, a Lexical Environment is removed from memory with all the variables  after the function call finishes. That’s because there are no references to it. As any JavaScript object, it’s only kept in memory while it’s  reachable.

However, if there’s a nested function that is still reachable after the end of a function, then it has `[[Environment]]` property that references the lexical environment.

In that case the Lexical Environment is still reachable even after the completion of the function, so it stays alive.

For example:

```javascript
function f() {
  let value = 123;

  return function() {
    alert(value);
  }
}

let g = f(); // g.[[Environment]] stores a reference to the Lexical Environment
// of the corresponding f() call
```

Please note that if `f()` is called many  times, and resulting functions are saved, then all corresponding Lexical Environment objects will also be retained in memory. In the code below, all 3 of them:

```javascript
function f() {
  let value = Math.random();

  return function() { alert(value); };
}

// 3 functions in array, every one of them links to Lexical Environment
// from the corresponding f() run
let arr = [f(), f(), f()];
```

A Lexical Environment object dies when it becomes  unreachable (just like any other object). In other words, it exists only while there’s at least one nested function referencing it.

In the code below, after the nested function is removed, its enclosing Lexical Environment (and hence the `value`) is cleaned from memory:

```javascript
function f() {
  let value = 123;

  return function() {
    alert(value);
  }
}

let g = f(); // while g function exists, the value stays in memory

g = null; // ...and now the memory is cleaned up
```

### [Real-life optimizations](https://javascript.info/closure#real-life-optimizations)

As we’ve seen, in theory while a function is alive, all outer variables are also retained.

But in practice, JavaScript engines try to optimize that. They  analyze variable usage and if it’s obvious from the code that an outer  variable is not used – it is removed.

**An important side effect in V8 (Chrome, Edge, Opera) is that such variable will become unavailable in debugging.**

Try running the example below in Chrome with the Developer Tools open.

When it pauses, in the console type `alert(value)`.

​                      

​                      

```javascript
function f() {
  let value = Math.random();

  function g() {
    debugger; // in console: type alert(value); No such variable!
  }

  return g;
}

let g = f();
g();
```

As you could see – there is no such variable! In theory, it should be accessible, but the engine optimized it out.

That may lead to funny (if not such time-consuming) debugging issues. One of them – we can see a same-named outer variable instead of the  expected one:

​                      

​                      

```javascript
let value = "Surprise!";

function f() {
  let value = "the closest value";

  function g() {
    debugger; // in console: type alert(value); Surprise!
  }

  return g;
}

let g = f();
g();
```

This feature of V8 is good to know. If you are debugging with Chrome/Edge/Opera, sooner or later you will meet it.

That is not a bug in the debugger, but rather a special feature of  V8. Perhaps it will be changed sometime. You can always check for it by  running the examples on this page.

## [Tasks](https://javascript.info/closure#tasks)

### [Does a function pickup latest changes?](https://javascript.info/closure#does-a-function-pickup-latest-changes)



importance: 5

The function sayHi uses an external variable name. When the function runs, which value is it going to use?

```javascript
let name = "John";

function sayHi() {
  alert("Hi, " + name);
}

name = "Pete";

sayHi(); // what will it show: "John" or "Pete"?
```

Such situations are common both in browser and  server-side development. A function may be scheduled to execute later  than it is created, for instance after a user action or a network  request.

So, the question is: does it pick up the latest changes?

### [Which variables are available?](https://javascript.info/closure#which-variables-are-available)



importance: 5

The function `makeWorker` below makes another function and returns it. That new function can be called from somewhere else.

Will it have access to the outer variables from its creation place, or the invocation place, or both?

```javascript
function makeWorker() {
  let name = "Pete";

  return function() {
    alert(name);
  };
}

let name = "John";

// create a function
let work = makeWorker();

// call it
work(); // what will it show?
```

Which value it will show? “Pete” or “John”?

### [Are counters independent?](https://javascript.info/closure#are-counters-independent)



importance: 5

Here we make two counters: `counter` and `counter2` using the same `makeCounter` function.

Are they independent? What is the second counter going to show? `0,1` or `2,3` or something else?

```javascript
function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();
let counter2 = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1

alert( counter2() ); // ?
alert( counter2() ); // ?
```

### [Counter object](https://javascript.info/closure#counter-object)



importance: 5

Here a counter object is made with the help of the constructor function.

Will it work? What will it show?

```javascript
function Counter() {
  let count = 0;

  this.up = function() {
    return ++count;
  };
  this.down = function() {
    return --count;
  };
}

let counter = new Counter();

alert( counter.up() ); // ?
alert( counter.up() ); // ?
alert( counter.down() ); // ?
```

### [Function in if](https://javascript.info/closure#function-in-if)



importance: 5

Look at the code. What will be the result of the call at the last line?

​                      

​                      

```javascript
let phrase = "Hello";

if (true) {
  let user = "John";

  function sayHi() {
    alert(`${phrase}, ${user}`);
  }
}

sayHi();
```

### [Sum with closures](https://javascript.info/closure#sum-with-closures)



importance: 4

Write function `sum` that works like this: `sum(a)(b) = a+b`.

Yes, exactly this way, using double parentheses (not a mistype).

For instance:

```javascript
sum(1)(2) = 3
sum(5)(-1) = 4
```

### [Is variable visible?](https://javascript.info/closure#is-variable-visible)



importance: 4

What will be the result of this code?

```javascript
let x = 1;

function func() {
  console.log(x); // ?

  let x = 2;
}

func();
```

P.S. There’s a pitfall in this task. The solution is not obvious.

### [Filter through function](https://javascript.info/closure#filter-through-function)



importance: 5

We have a built-in method `arr.filter(f)` for arrays. It filters all elements through the function `f`. If it returns `true`, then that element is returned in the resulting array.

Make a set of “ready to use” filters:

- `inBetween(a, b)` – between `a` and `b` or equal to them (inclusively).
- `inArray([...])` – in the given array.

The usage must be like this:

- `arr.filter(inBetween(3,6))` – selects only values between 3 and 6.
- `arr.filter(inArray([1,2,3]))` – selects only elements matching with one of the members of `[1,2,3]`.

For instance:

```javascript
/* .. your code for inBetween and inArray */
let arr = [1, 2, 3, 4, 5, 6, 7];

alert( arr.filter(inBetween(3, 6)) ); // 3,4,5,6

alert( arr.filter(inArray([1, 2, 10])) ); // 1,2
```

[Open a sandbox with tests.](https://plnkr.co/edit/VjHggNnmZjJqoUyY?p=preview)

### [Sort by field](https://javascript.info/closure#sort-by-field)



importance: 5

We’ve got an array of objects to sort:

```javascript
let users = [
  { name: "John", age: 20, surname: "Johnson" },
  { name: "Pete", age: 18, surname: "Peterson" },
  { name: "Ann", age: 19, surname: "Hathaway" }
];
```

The usual way to do that would be:

```javascript
// by name (Ann, John, Pete)
users.sort((a, b) => a.name > b.name ? 1 : -1);

// by age (Pete, Ann, John)
users.sort((a, b) => a.age > b.age ? 1 : -1);
```

Can we make it even less verbose, like this?

```javascript
users.sort(byField('name'));
users.sort(byField('age'));
```

So, instead of writing a function, just put `byField(fieldName)`.

Write the function `byField` that can be used for that.

[Open a sandbox with tests.](https://plnkr.co/edit/NVcpKrKxSrM51sLP?p=preview)

### [Army of functions](https://javascript.info/closure#army-of-functions)



importance: 5

The following code creates an array of `shooters`.

Every function is meant to output its number. But something is wrong…

​                      

​                      

```javascript
function makeArmy() {
  let shooters = [];

  let i = 0;
  while (i < 10) {
    let shooter = function() { // create a shooter function,
      alert( i ); // that should show its number
    };
    shooters.push(shooter); // and add it to the array
    i++;
  }

  // ...and return the array of shooters
  return shooters;
}

let army = makeArmy();

// all shooters show 10 instead of their numbers 0, 1, 2, 3...
army[0](); // 10 from the shooter number 0
army[1](); // 10 from the shooter number 1
army[2](); // 10 ...and so on.
```

Why do all of the shooters show the same value?

Fix the code so that they work as intended.

[Open a sandbox with tests.](https://plnkr.co/edit/HpB8vhw3UAlD3wEI?p=preview)