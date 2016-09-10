# Kompo Extension

This repository contains utility functions which are provided for ease-of-use or syntactic sugar, more or less specific for the Kompo library.

BEWARE: It extends builtin javascript objects, so if you don't like that don't use this repository. [Take a look at Kompo Util](https://github.com/rubenhazelaar/kompo-util)

## Kompo

Kompo is a react js like library which tries to stay as simple as possible. No virtual DOM or JSX. 
Kompo loves the DOM & makes it possible to build interfaces through components.

[Check out Kompo](https://github.com/rubenhazelaar/kompo)
 
## Install

```bash
npm install --save kompo-extension
```

## Build

```bash
npm run build
```

Need the UMD or minified build? Use:

```bash
npm run build:umd
```

```bash 
npm run build:min
```

## Test

```bash
npm test
```

Please note: testing is still a work-in-progress and you can help out! Please check out the 'Contribute' section below.

## How to use

```javascript
import extension from 'kompo-extension';
extension(/* add prefix if you like */); 

// Use extended functions on all Elements;
```

Check out `./src/extension.js` for all avaiable functions and their descriptions.

## Contribute

Would you like to contribute? Great!

Please keep the following in mind:

* Please follow the existing code style.  You can also use `npm run lint` to help.
* Write your code in a fashion which is easy to read and understand.
* Commit your changes by using `npm run commit`.
* Create pull requests for proposals or possible additions to the code base.
* Testing, testing, testing. Still a lot of work here. However each feature should come with a test.