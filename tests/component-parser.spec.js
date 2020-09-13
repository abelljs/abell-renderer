const fs = require('fs');
const path = require('path');

const {
  parseAttributes,
  componentTagTranspiler,
  parseComponent
} = require('../src/parsers/component-parser.js');

describe('parseAttributes()', () => {
  it('should turn string attributes into object', () => {
    expect(parseAttributes('inlined bundle="app.js"')).toEqual({
      inlined: true,
      bundle: 'app.js'
    });
  });

  it('should return nothing for no attributes', () => {
    expect(parseAttributes('')).toEqual({});
  });

  it('should handle attribute values in single quotes', () => {
    expect(parseAttributes("inlined bundle='app.js'")).toEqual({
      inlined: true,
      bundle: 'app.js'
    });
  });

  it('should allow inlined=false in attribute', () => {
    expect(parseAttributes('inlined=false')).toEqual({
      inlined: 'false'
    });
  });

  it('should handle custom attributes as well', () => {
    expect(
      parseAttributes(
        `rel="preload" 
        as="style" 
        onload="this.rel=\"stylesheet\"; this.onload = null"`
      )
    ).toEqual({
      rel: 'preload',
      as: 'style',
      onload: 'this.rel="stylesheet"; this.onload = null'
    });
  });
});

describe('componentTagTranspiler()', () => {
  // eslint-disable-next-line max-len
  it('should parse Abell Component Tag to Component Object before execution', () => {
    const code = `
    var Nav = require('./components/Nav.abell');
    <div>
      <Nav
        props={
          foo: 'bar'
        }
      />
      <NotComponent/>
    </div>
    `;

    expect(componentTagTranspiler(code)).toMatchSnapshot();
  });
});

describe('parseComponent()', () => {
  it('should parse component and return a componentTree - Sample.abell', () => {
    const abellFile = path.join(__dirname, 'resources', 'Sample.abell');
    const abellContent = fs.readFileSync(abellFile, 'utf-8');
    const componentTree = parseComponent(
      abellContent,
      path.join(__dirname, 'resources', 'Sample.abell'),
      {
        foo: '123TEST'
      },
      { filename: 'component-parser.spec.js' }
    );

    expect(componentTree.renderedHTML).toMatchSnapshot();

    expect(componentTree.styles[0].content).toMatchSnapshot();
    expect(Object.keys(componentTree.styles[0])).toEqual(
      expect.arrayContaining([
        'component',
        'attributes',
        'componentPath',
        'content'
      ])
    );

    expect(componentTree.scripts[0].content).toMatchSnapshot();

    expect(Object.keys(componentTree.scripts[0])).toEqual(
      expect.arrayContaining([
        'component',
        'attributes',
        'componentPath',
        'content'
      ])
    );
  });

  it('should work for nested components - Parent.abell', () => {
    const abellFile = path.join(__dirname, 'resources', 'Parent.abell');
    const abellContent = fs.readFileSync(abellFile, 'utf-8');
    const componentTree = parseComponent(
      abellContent,
      path.join(__dirname, 'resources', 'Parent.abell'),
      {},
      {
        allowRequire: true,
        filename: 'component-parser.spec.js',
        basePath: path.join(__dirname, 'resources')
      }
    );

    expect(componentTree.renderedHTML).toMatchSnapshot();

    expect(componentTree.components[0].styles[0].content).toMatchSnapshot();

    expect(Object.keys(componentTree.components[0].styles[0])).toEqual(
      expect.arrayContaining([
        'component',
        'attributes',
        'componentPath',
        'content'
      ])
    );

    expect(componentTree.styles.length).toBe(0);
    expect(componentTree.scripts.length).toBe(1);
  });
});
