const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

const { render } = require('../src/index');
const hash = require('../src/hash');
const { normalizePath } = require('../src/render-utils');

describe('scoped css', () => {
  // loading and rendering test component
  const fileData = fs
    .readFileSync(path.join(__dirname, 'resources', 'scoped', 'Main.abell'))
    .toString();
  const basePath = path.join(__dirname, 'resources', 'scoped');
  const renderedComponent = render(
    fileData,
    {},
    {
      allowRequire: true,
      allowComponents: true,
      basePath
    }
  );

  it('should have a stable html snapshot', () => {
    expect(renderedComponent.html).toMatchSnapshot();
  });

  it('should have the scoped component', () => {
    const scopedPath = path.relative(
      process.cwd(),
      path.join(basePath, 'Scoped.abell')
    );
    // we normalize the path for windows so that hash is stable across OS
    const componentHash = normalizePath(hash(scopedPath));

    const scopedComponent = renderedComponent.components[0];
    expect(scopedComponent).toBeDefined();

    const $ = cheerio.load(scopedComponent.renderedHTML);
    expect($(`div[data-abell-${componentHash}]`).html()).toMatchSnapshot();

    expect(scopedComponent.styles).toHaveLength(1);

    const componentStyle = scopedComponent.styles[0];

    expect(componentStyle.content).toContain(
      `div[data-abell-${componentHash}]`
    );
    expect(scopedComponent.scripts).toHaveLength(0);
  });

  it('should have the global component', () => {
    const globalComponentPath = path.relative(
      process.cwd(),
      path.join(basePath, 'Global.abell')
    );
    // we normalize the path for windows
    const componentHash = normalizePath(hash(globalComponentPath));

    const globalComponent = renderedComponent.components[1];
    expect(globalComponent).toBeDefined();

    const $ = cheerio.load(globalComponent.renderedHTML);
    expect($(`div[data-abell-${componentHash}]`).html()).toMatchSnapshot();

    expect(globalComponent.styles).toHaveLength(1);

    const componentStyle = globalComponent.styles[0];

    expect(componentStyle.content).not.toContain(
      `div[data-abell-${componentHash}]`
    );

    expect(componentStyle.attributes.global).toBe(true);
    expect(globalComponent.scripts).toHaveLength(0);
  });
});
