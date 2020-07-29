# Changelog

## v0.2.0-alpha.8

- Multi-line support for writing component tag.

## v0.2.0-alpha.7

- Convert Array into String by joining the values.
- Now devs would not have to write `.join` next to map, to remove commas.

## v0.2.0-alpha.5

- Naming rule of having `.component.abell` extension, removed. Any file that ends with `.abell`, can be a component.

## v0.2.0-alpha.4

- Filename and error line in error stack 🎉
- Error when brackets and value had no space, fixed (e.g. `{{a}}`)

## v0.2.0-alpha.3

- Nested Components
- Better Error logs

## v0.2.0-alpha.1

- Support for Abell Components when `allowComponents` flag is passed in options. (Does not support nested components yet)

## v0.1.12

- Throw error at `execute` to avoid having vm data in error stack

## v0.1.11

- Trim value before adding.

## v0.1.10

- **BREAKING CHANGE**, **SECURITY UPDATE**
  To use `require()` in the template, user will have to pass `allowRequire: true` in option. This option is by default set to false.
  ```js
  const newHTMLTemplate = abellRenderer.render(myAbellTemplate, mySandbox, {
    allowRequire: true
  });
  ```

## v0.1.9

- Fix to recursively find and create nested `.abell` files

## v0.1.8

- basePath is set to paths relative to input files.

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
