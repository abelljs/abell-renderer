<p align="center"><img alt="Abell renderer cover" src="https://res.cloudinary.com/saurabhdaware/image/upload/v1588856971/abell/abellrendererghhead.png"></p>


<p align="center"><b>NOT READY FOR PRODUCTION USE</b></p>


<p align="center">
<a href="https://npmjs.org/package/abell-renderer"><img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/abelljs/abell-renderer?style=for-the-badge&labelColor=black&logo=npm&label=abell%20renderer&color=darkred"></a>&nbsp; <a href="https://join.slack.com/t/abellland/shared_invite/zt-ebklbe8h-FhRgHxNbuO_hvFDf~nZtGQ"><img src="https://img.shields.io/badge/slack-join%20channel-4A154B?style=for-the-badge&logo=slack&logoColor=pink&labelColor=black"/></a>
</p>

<br/><br/>


<p align="left">A template parser that lets you use JavaScript syntax to render loops, conditions, do maths, and require JSONs from HTML on build time. Low level library used in <a href="https://github.com/abelljs/abell">abelljs/abell<a></p>


## 🚀 Installation & Usage

Executing directly with [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)

```shell
npx abell-renderer build --input src/index.abell --output dist/index.html
```

or
```shell
npm install -g abell-renderer
```

```shell
abell-renderer build --input src/index.abell --output dist/index.html
```


Check out [Abell Template Guide](#-abell-template-guide) for how to write `.abell` files.


## 📘 Abell Template Guide

`.abell` files are nothing but `.html` files which can contain JavaScript inside double curly brackets `{{` and `}}`.

*Note that abell-renderer renders abell files in NodeJS context which means you cannot access DOM inside brackets.*

Simplest example of **.abell** file can look like:
```jsx
{{ const siteTitle = "Abell Demo" }}
<html>
  <head>
    <title>{{ siteTitle }}</title>
  </head>
  <body>
    {{ 
      const a = 3;
      const b = 5;
    }}
    <h1>{{ siteTitle.toUpperCase() }}</h1>
    <div>Addition of {{ a }} and {{ b }} is {{ a + b }}</div>
  </body>
</html>
``` 

All the JavaScript inside curly brakets will be rendered on virtual instance on NodeJS and you will get the output as completely renderer **.html** file:
```html
<html>
  <head>
    <title>Abell Demo</title>
  </head>
  <body>
    <h1>ABELL DEMO</h1>
    <div>Addition of 3 and 5 is 8</div>
  </body>
</html>
```
### ➿ Loops in Abell

You can use JavaScript Array methods to loop over array. Other JavaScript Array methods like `.filter`, `.map`, `.reduce` can be used as well.

```jsx
{{ 
  const users = [
    {name: 'Saurabh', age: 20}, 
    {name: 'John Doe', age: 78}
  ] 
}}

<main>
  {{
    users.map(user => `
      <div>
        <h2>${user.name}</h2>
        <span>Age: ${user.age}</span>
      </div>
    `)
  }}
</main>

/*
Ouputs:

<main>
  <div>
    <h2>Saurabh</h2>
    <span>Age: 20</span>
  </div>
  <div>
    <h2>John Doe</h2>
    <span>Age: 78</span>
  </div>
</main>

```

### ⤵️ Import JS/JSON/NPM Modules
With Abell you can import your Native NodeJS Modules, NPM Modules, JS Files (should export data), and JSON Files with `require()`


```jsx
{{ const MarkdownIt = require('markdown-it') }} 
<!-- NPM Module to convert markdown to HTML (npm install --save markdown-it) -->

{{ const md = new MarkdownIt(); }}
<!DOCTYPE html>
<html>
  <body>
    {{ md.render("[Open Google](https://google.com)") }}
  </body>
</html>

/*
Outputs:

<!DOCTYPE html>
<html>
  <body>
    <p><a href="https://google.com">Open Google</a></p>
  </body>
</html>
*/
```

*Note: fs module or any module that deals with external files cannot be used. The only way to read any external file is require()*


## 💛 JavaScript API

```shell
npm install --save-dev abell-renderer
```

```js
const abellRenderer = require('abell-renderer');

const sandbox = {
  nameObjects: [
    {name: 'Nice'},
    {name: 'very cool'}
  ],
  globalMeta: {
    siteName: 'Abell Renderer Demo',
  }
};

const template = `
<body>
  <h1>{{ globalMeta.siteName }}</h1>
  <div class="article-container">
    {{
      nameObjects
        .map(content => '<b>' + content.name + '</b>')
        .join('');
    }}
  </div>
</body>
`

const htmlTemplate = abellRenderer.render(template, sandbox);

console.log(htmlTemplate);

/*
Outputs:
<body>
  <h1>Abell Renderer Demo</h1>
  <div class="article-container">
    <b>Nice</b>
    <b>very cool</b>
  </div>
</body>
*/
```
### 📚 Reference
`abellRenderer.render(template, sandbox, options)`

`template`: Abell template in String
`sandbox`: Object over which the scripts execute, Can define variables and inject them into script.
`options.basePath`: basePath which is prefixed on `require()` paths in abellTemplate. 


## 🤗 Contributing

### 🖥 Local Setup
- Fork the repository
- `git clone https://github.com/<your-github-username>/abell-renderer`
- `cd abell-renderer`
- `npm run dev` to run example from `src/example/example.js`


### 🏃 Run Tests
- `npm install` if you haven't already
- `npm test`

## 🕑 Changelogs

[CHANGELOG.md](CHANGELOG.md)


---

[<img alt="Buy me a Coffee Button" width=200 src="https://c5.patreon.com/external/logo/become_a_patron_button.png">](https://www.patreon.com/bePatron?u=31891872) &nbsp; [<img alt="Buy me a Coffee Button" width=200 src="https://cdn.buymeacoffee.com/buttons/default-yellow.png">](https://www.buymeacoffee.com/saurabhdaware)

For status updates you can follow me on [Twitter @saurabhcodes](https://twitter.com/saurabhcodes)