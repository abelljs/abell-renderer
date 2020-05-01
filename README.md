# abell-renderer

![GitHub package.json version](https://img.shields.io/github/package-json/v/abelljs/abell-renderer?style=for-the-badge)

*NOT READY FOR PRODUCTION USE*

A template parser that parses JavaScript written inside HTML on build time.

Only works in NodeJS Environment.

## Installation

```shell
npm install --save-dev abell-renderer
```


## Usage
Not to be used in production yet.

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
      nameObjects.map(content => '<b>' + content.name + '</b>').join('');
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


## Contributing

### Local Setup
- Fork the repository
- `git clone https://github.com/<your-github-username>/abell-renderer`
- `cd abell-renderer`
- `npm run dev` to run example from `src/example/example.js`


### Running Tests
- `npm install` if you haven't already
- `npm test`


---

[<img alt="Buy me a Coffee Button" width=200 src="https://c5.patreon.com/external/logo/become_a_patron_button.png">](https://www.patreon.com/bePatron?u=31891872) &nbsp; [<img alt="Buy me a Coffee Button" width=200 src="https://cdn.buymeacoffee.com/buttons/default-yellow.png">](https://www.buymeacoffee.com/saurabhdaware)

For status updates you can follow me on [Twitter @saurabhcodes](https://twitter.com/saurabhcodes)