# Logical operators

There are four logical operators in JavaScript: `||` (OR), `&&` (AND), `!` (NOT), `??` (Nullish Coalescing). Here we cover the first three, the `??` operator is in the next article.

Although they are called “logical”, they can be applied to values of  any type, not only boolean. Their result can also be of any type.

Let’s see the details.

## [|| (OR)](https://javascript.info/logical-operators#or)

The “OR” operator is represented with two vertical line symbols:

```javascript
result = a || b;
```

In classical programming, the logical OR is meant to manipulate boolean values only. If any of its arguments are `true`, it returns `true`, otherwise it returns `false`.

In JavaScript, the operator is a little bit trickier and more powerful. But first, let’s see what happens with boolean values.

There are four possible logical combinations:

​                      

​                      

```javascript
alert( true || true );   // true
alert( false || true );  // true
alert( true || false );  // true
alert( false || false ); // false
```

As we can see, the result is always `true` except for the case when both operands are `false`.

If an operand is not a boolean, it’s converted to a boolean for the evaluation.

For instance, the number `1` is treated as `true`, the number `0` as `false`:

​                      

​                      

```javascript
if (1 || 0) { // works just like if( true || false )
  alert( 'truthy!' );
}
```

Most of the time, OR `||` is used in an `if` statement to test if *any* of the given conditions is `true`.

For example:

​                      

​                      

```javascript
let hour = 9;

if (hour < 10 || hour > 18) {
  alert( 'The office is closed.' );
}
```

We can pass more conditions:

​                      

​                      

```javascript
let hour = 12;
let isWeekend = true;

if (hour < 10 || hour > 18 || isWeekend) {
  alert( 'The office is closed.' ); // it is the weekend
}
```

## [OR "||" finds the first truthy value](https://javascript.info/logical-operators#or-finds-the-first-truthy-value)

The logic described above is somewhat classical. Now, let’s bring in the “extra” features of JavaScript.

The extended algorithm works as follows.

Given multiple OR’ed values:

```javascript
result = value1 || value2 || value3;
```

The OR `||` operator does the following:

- Evaluates operands from left to right.
- For each operand, converts it to boolean. If the result is `true`, stops and returns the original value of that operand.
- If all operands have been evaluated (i.e. all were `false`), returns the last operand.

A value is returned in its original form, without the conversion.

In other words, a chain of OR `||` returns the first truthy value or the last one if no truthy value is found.

For instance:

​                      

​                      

```javascript
alert( 1 || 0 ); // 1 (1 is truthy)

alert( null || 1 ); // 1 (1 is the first truthy value)
alert( null || 0 || 1 ); // 1 (the first truthy value)

alert( undefined || null || 0 ); // 0 (all falsy, returns the last value)
```

This leads to some interesting usage compared to a “pure, classical, boolean-only OR”.

1. **Getting the first truthy value from a list of variables or expressions.**

   For instance, we have `firstName`, `lastName` and `nickName` variables, all optional (i.e. can be undefined or have falsy values).

   Let’s use OR `||` to choose the one that has the data and show it (or `"Anonymous"` if nothing set):

   ​                      

   ​                      

   ```javascript
   let firstName = "";
   let lastName = "";
   let nickName = "SuperCoder";
   
   alert( firstName || lastName || nickName || "Anonymous"); // SuperCoder
   ```

   If all variables were falsy, `"Anonymous"` would show up.

2. **Short-circuit evaluation.**

   Another feature of OR `||` operator is the so-called “short-circuit” evaluation.

   It means that `||` processes its arguments until the first truthy value is reached, and then the value is returned immediately,  without even touching the other argument.

   The importance of this feature becomes obvious if an operand isn’t  just a value, but an expression with a side effect, such as a variable  assignment or a function call.

   In the example below, only the second message is printed:

   ​                      

   ​                      

   ```javascript
   true || alert("not printed");
   false || alert("printed");
   ```

   In the first line, the OR `||` operator stops the evaluation immediately upon seeing `true`, so the `alert` isn’t run.

   Sometimes, people use this feature to execute commands only if the condition on the left part is falsy.

## [&& (AND)](https://javascript.info/logical-operators#and)

The AND operator is represented with two ampersands `&&`:

```javascript
result = a && b;
```

In classical programming, AND returns `true` if both operands are truthy and `false` otherwise:

​                      

​                      

```javascript
alert( true && true );   // true
alert( false && true );  // false
alert( true && false );  // false
alert( false && false ); // false
```

An example with `if`:

​                      

​                      

```javascript
let hour = 12;
let minute = 30;

if (hour == 12 && minute == 30) {
  alert( 'The time is 12:30' );
}
```

Just as with OR, any value is allowed as an operand of AND:

​                      

​                      

```javascript
if (1 && 0) { // evaluated as true && false
  alert( "won't work, because the result is falsy" );
}
```

## [AND “&&” finds the first falsy value](https://javascript.info/logical-operators#and-finds-the-first-falsy-value)

Given multiple AND’ed values:

```javascript
result = value1 && value2 && value3;
```

The AND `&&` operator does the following:

- Evaluates operands from left to right.
- For each operand, converts it to a boolean. If the result is `false`, stops and returns the original value of that operand.
- If all operands have been evaluated (i.e. all were truthy), returns the last operand.

In other words, AND returns the first falsy value or the last value if none were found.

The rules above are similar to OR. The difference is that AND returns the first *falsy* value while OR returns the first *truthy* one.

Examples:

​                      

​                      

```javascript
// if the first operand is truthy,
// AND returns the second operand:
alert( 1 && 0 ); // 0
alert( 1 && 5 ); // 5

// if the first operand is falsy,
// AND returns it. The second operand is ignored
alert( null && 5 ); // null
alert( 0 && "no matter what" ); // 0
```

We can also pass several values in a row. See how the first falsy one is returned:

​                      

​                      

```javascript
alert( 1 && 2 && null && 3 ); // null
```

When all values are truthy, the last value is returned:

​                      

​                      

```javascript
alert( 1 && 2 && 3 ); // 3, the last one
```

Precedence of AND `&&` is higher than OR `||`

The precedence of AND `&&` operator is higher than OR `||`.

So the code `a && b || c && d` is essentially the same as if the `&&` expressions were in parentheses: `(a && b) || (c && d)`.

Don’t replace `if` with `||` or `&&`

Sometimes, people use the AND `&&` operator as a “shorter way to write `if`”.

For instance:

​                      

​                      

```javascript
let x = 1;

(x > 0) && alert( 'Greater than zero!' );
```

The action in the right part of `&&` would execute only if the evaluation reaches it. That is, only if `(x > 0)` is true.

So we basically have an analogue for:

​                      

​                      

```javascript
let x = 1;

if (x > 0) alert( 'Greater than zero!' );
```

Although, the variant with `&&` appears shorter, `if` is more obvious and tends to be a little bit more readable. So we recommend using every construct for its purpose: use `if` if we want `if` and use `&&` if we want AND.

## [! (NOT)](https://javascript.info/logical-operators#not)

The boolean NOT operator is represented with an exclamation sign `!`.

The syntax is pretty simple:

```javascript
result = !value;
```

The operator accepts a single argument and does the following:

1. Converts the operand to boolean type: `true/false`.
2. Returns the inverse value.

For instance:

​                      

​                      

```javascript
alert( !true ); // false
alert( !0 ); // true
```

A double NOT `!!` is sometimes used for converting a value to boolean type:

​                      

​                      

```javascript
alert( !!"non-empty string" ); // true
alert( !!null ); // false
```

That is, the first NOT converts the value to boolean and  returns the inverse, and the second NOT inverses it again. In the end,  we have a plain value-to-boolean conversion.

There’s a little more verbose way to do the same thing – a built-in `Boolean` function:

​                      

​                      

```javascript
alert( Boolean("non-empty string") ); // true
alert( Boolean(null) ); // false
```

The precedence of NOT `!` is the highest of all logical operators, so it always executes first, before `&&` or `||`.

## [Tasks](https://javascript.info/logical-operators#tasks)

### [What's the result of OR?](https://javascript.info/logical-operators#what-s-the-result-of-or)



importance: 5

What is the code below going to output?

```javascript
alert( null || 2 || undefined );
```

### [What's the result of OR'ed alerts?](https://javascript.info/logical-operators#what-s-the-result-of-or-ed-alerts)



importance: 3

What will the code below output?

```javascript
alert( alert(1) || 2 || alert(3) );
```

### [What is the result of AND?](https://javascript.info/logical-operators#what-is-the-result-of-and)



importance: 5

What is this code going to show?

```javascript
alert( 1 && null && 2 );
```

### [What is the result of AND'ed alerts?](https://javascript.info/logical-operators#what-is-the-result-of-and-ed-alerts)



importance: 3

What will this code show?

```javascript
alert( alert(1) && alert(2) );//alert return undefined
```

### [The result of OR AND OR](https://javascript.info/logical-operators#the-result-of-or-and-or)



importance: 5

What will the result be?

```javascript
alert( null || 2 && 3 || 4 );
```

### [Check the range between](https://javascript.info/logical-operators#check-the-range-between)



importance: 3

Write an `if` condition to check that `age` is between `14` and `90` inclusively.

“Inclusively” means that `age` can reach the edges `14` or `90`.

### [Check the range outside](https://javascript.info/logical-operators#check-the-range-outside)



importance: 3

Write an `if` condition to check that `age` is NOT between `14` and `90` inclusively.

Create two variants: the first one using NOT `!`, the second one – without it.

### [A question about "if"](https://javascript.info/logical-operators#a-question-about-if)



importance: 5

Which of these `alert`s are going to execute?

What will the results of the expressions be inside `if(...)`?

```javascript
if (-1 || 0) alert( 'first' );
if (-1 && 0) alert( 'second' );
if (null || -1 && 1) alert( 'third' );
```

### [Check the login](https://javascript.info/logical-operators#check-the-login)



importance: 3

Write the code which asks for a login with `prompt`.

If the visitor enters `"Admin"`, then `prompt` for a password, if the input is an empty line or Esc – show “Canceled”, if it’s another string – then show “I don’t know you”.

The password is checked as follows:

- If it equals “TheMaster”, then show “Welcome!”,
- Another string – show “Wrong password”,
- For an empty string or cancelled input, show “Canceled”

The schema:

Please use nested `if` blocks. Mind the overall readability of the code.

Hint:  passing an empty input to a prompt returns an empty string `''`. Pressing ESC during a prompt returns `null`.

[Run the demo](https://javascript.info/logical-operators#)







# Nullish coalescing operator '??'

A recent addition

​            This is a recent addition to the language.            Old browsers may need [polyfills](https://javascript.info/polyfills).            

The nullish coalescing operator is written as two question marks `??`.

As it treats `null` and `undefined` similarly, we’ll use a special term here, in this article. For brevity, we’ll say that a value is “defined” when it’s neither `null` nor `undefined`.

The result of `a ?? b` is:

- if `a` is defined, then `a`,
- if `a` isn’t defined, then `b`.

In other words, `??` returns the first argument if it’s not `null/undefined`. Otherwise, the second one.

The nullish coalescing operator isn’t anything completely new. It’s  just a nice syntax to get the first “defined” value of the two.

We can rewrite `result = a ?? b` using the operators that we already know, like this:

```javascript
result = (a !== null && a !== undefined) ? a : b;
```

Now it should be absolutely clear what `??` does. Let’s see where it helps.

The common use case for `??` is to provide a default value.

For example, here we show `user` if its value isn’t `null/undefined`, otherwise `Anonymous`:

​                      

​                      

```javascript
let user;

alert(user ?? "Anonymous"); // Anonymous (user is undefined)
```

Here’s the example with `user` assigned to a name:

​                      

​                      

```javascript
let user = "John";

alert(user ?? "Anonymous"); // John (user is not null/undefined)
```

We can also use a sequence of `??` to select the first value from a list that isn’t `null/undefined`.

Let’s say we have a user’s data in variables `firstName`, `lastName` or `nickName`. All of them may be not defined, if the user decided not to fill in the corresponding values.

We’d like to display the user name using one of these variables, or show “Anonymous” if all of them are `null/undefined`.

Let’s use the `??` operator for that:

​                      

​                      

```javascript
let firstName = null;
let lastName = null;
let nickName = "Supercoder";

// shows the first defined value:
alert(firstName ?? lastName ?? nickName ?? "Anonymous"); // Supercoder
```

## [Comparison with ||](https://javascript.info/nullish-coalescing-operator#comparison-with)

The OR `||` operator can be used in the same way as `??`, as it was described in the [previous chapter](https://javascript.info/logical-operators#or-finds-the-first-truthy-value).

For example, in the code above we could replace `??` with `||` and still get the same result:

​                      

​                      

```javascript
let firstName = null;
let lastName = null;
let nickName = "Supercoder";

// shows the first truthy value:
alert(firstName || lastName || nickName || "Anonymous"); // Supercoder
```

Historically, the OR `||` operator was there  first. It’s been there since the beginning of JavaScript, so developers  were using it for such purposes for a long time.

On the other hand, the nullish coalescing operator `??` was added to JavaScript only recently, and the reason for that was that people weren’t quite happy with `||`.

The important difference between them is that:

- `||` returns the first *truthy* value.
- `??` returns the first *defined* value.

In other words, `||` doesn’t distinguish between `false`, `0`, an empty string `""` and `null/undefined`. They are all the same – falsy values. If any of these is the first argument of `||`, then we’ll get the second argument as the result.

In practice though, we may want to use default value only when the variable is `null/undefined`. That is, when the value is really unknown/not set.

For example, consider this:

​                      

​                      

```javascript
let height = 0;

alert(height || 100); // 100
alert(height ?? 100); // 0
```

- The `height || 100` checks `height` for being a falsy value, and it’s `0`, falsy indeed.
  - so the result of `||` is the second argument, `100`.
- The `height ?? 100` checks `height` for being `null/undefined`, and it’s not,
  - so the result is `height` “as is”, that is `0`.

In practice, the zero height is often a valid value, that shouldn’t be replaced with the default. So `??` does just the right thing.

## [Precedence](https://javascript.info/nullish-coalescing-operator#precedence)

The precedence of the `??` operator is the same as `||`. They both equal `3` in the [MDN table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table).

That means that, just like `||`, the nullish coalescing operator `??` is evaluated before `=` and `?`, but after most other operations, such as `+`, `*`.

So we may need to add parentheses in expressions like this:

​                      

​                      

```javascript
let height = null;
let width = null;

// important: use parentheses
let area = (height ?? 100) * (width ?? 50);

alert(area); // 5000
```

Otherwise, if we omit parentheses, then as `*` has the higher precedence than `??`, it would execute first, leading to incorrect results.

```javascript
// without parentheses
let area = height ?? 100 * width ?? 50;

// ...works this way (not what we want):
let area = height ?? (100 * width) ?? 50;
```

### [Using ?? with && or ||](https://javascript.info/nullish-coalescing-operator#using-with-or)

Due to safety reasons, JavaScript forbids using `??` together with `&&` and `||` operators, unless the precedence is explicitly specified with parentheses.

The code below triggers a syntax error:

​                      

​                      

```javascript
let x = 1 && 2 ?? 3; // Syntax error
```

The limitation is surely debatable, it was added to the  language specification with the purpose to avoid programming mistakes,  when people start to switch from `||` to `??`.

Use explicit parentheses to work around it:

​                      

​                      

```javascript
let x = (1 && 2) ?? 3; // Works

alert(x); // 2
```

## [Summary](https://javascript.info/nullish-coalescing-operator#summary)

- The nullish coalescing operator `??` provides a short way to choose the first “defined” value from a list.

  It’s used to assign default values to variables:

  ```javascript
  // set height=100, if height is null or undefined
  height = height ?? 100;
  ```

- The operator `??` has a very low precedence, only a bit higher than `?` and `=`, so consider adding parentheses when using it in an expression.

- It’s forbidden to use it with `||` or `&&` without explicit parentheses.