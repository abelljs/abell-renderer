<p align="center"><img alt="Abell renderer cover" src="https://res.cloudinary.com/saurabhdaware/image/upload/v1588856252/abell/abellrendererghhead.png"></p>


<p align="center"><b>NOT READY FOR PRODUCTION USE</b></p>

<p align="center">A template parser that parses JavaScript written inside HTML on build time.</p>

<p align="center">
<a href="https://npmjs.org/package/abell-renderer"><img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/abelljs/abell-renderer?style=for-the-badge&labelColor=black&logo=npm&label=abell%20renderer&color=darkred"></a>&nbsp; <a href="https://join.slack.com/t/abellland/shared_invite/zt-ebklbe8h-FhRgHxNbuO_hvFDf~nZtGQ"><img src="https://img.shields.io/badge/slack-join%20channel-4A154B?style=for-the-badge&logo=slack&logoColor=pink&labelColor=black"/></a>
</p>


## Installation
***Note**: Only works in NodeJS Environment*
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


## Contributing

### Local Setup
- Fork the repository
- `git clone https://github.com/<your-github-username>/abell-renderer`
- `cd abell-renderer`
- `npm run dev` to run example from `src/example/example.js`


### Running Tests
- `npm install` if you haven't already
- `npm test`

## Changelogs

[CHANGELOG.md](CHANGELOG.md)


---

[<img alt="Buy me a Coffee Button" width=200 src="https://c5.patreon.com/external/logo/become_a_patron_button.png">](https://www.patreon.com/bePatron?u=31891872) &nbsp; [<img alt="Buy me a Coffee Button" width=200 src="https://cdn.buymeacoffee.com/buttons/default-yellow.png">](https://www.buymeacoffee.com/saurabhdaware)

For status updates you can follow me on [Twitter @saurabhcodes](https://twitter.com/saurabhcodes)