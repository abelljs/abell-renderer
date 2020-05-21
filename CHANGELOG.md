# Changelog

## v0.1.7
- **BUG FIX**
  Allowing CLI to build without output path

## v0.1.6
- **MAJOR CHANGE**
  Added ability to escape the brackets with a slash('\')

## v0.1.5
- Support for expression after `require` (e.g. `require('module1').someProperty`)
- Build a folder with CLI (Issue: [#6](https://github.com/abelljs/abell-renderer/issues/6), PR: [#8](https://github.com/abelljs/abell-renderer/pull/8), Thanks to [@Pika1998](https://github.com/Pika1998))

## v0.1.4
- Error handling when the temlate does not have any `{{` `}}`
- More tests written for `render()` function

## v0.1.3
- Refactoring of major logic
- Conditions executed as assignment bug fixed
- More tests added in Unit Testing.
- Support for multiple requires in same code block (Thanks to [@Pika1998](https://github.com/Pika1998) for [#5](https://github.com/abelljs/abell-renderer/pull/5))
- Redesign of Readme
- Template build time added to CLI

## v0.1.2
BREAKING CHANGE
- `abell-renderer [flags]` changed to `abell-renderer build [flags]`
- `help, --version` added.

## v0.1.1
Bug that stored last value and printed it when assignment was used, fixed.

## v0.1.0
Better log messages added in CLI

## v0.1.0-beta.1
- CLI added to render `.abell` files

## v0.1.0-alpha.2
- Support for nodejs modules

## v0.1.0-alpha.1
- Sequential compilation of JavaScript [#2](https://github.com/abelljs/abell-renderer/issues/2)
- Require values from json/js in .abell files


## v0.0.3
Ability to add functions inside curly brackets

```js
<div>
{{
  () => 3 + 5
}}
</div>
```

outputs:
```html
<div>
  8
</div>
```

## < v0.0.2
Initilization and overall setup