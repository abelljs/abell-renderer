const path = require('path');

const {
  parseAttribute,
  parseComponentTags,
  parseComponent
} = require('../src/component-parser.js');

describe('parseAttribute()', () => {
  it('should turn string attributes into object', () => {
    expect(parseAttribute('inlined bundle="app.js"')).toEqual({
      inlined: true,
      bundle: 'app.js'
    });
  });

  it('should allow inlined=false in attribute', () => {
    expect(parseAttribute('inlined=false')).toEqual({
      inlined: 'false'
    });
  });

  it('should handle custom attributes as well', () => {
    expect(
      parseAttribute(
        `rel="preload" 
        as="style" 
        onload="this.rel=\"stylesheet\";this.onload=null"`
      )
    ).toEqual({
      rel: 'preload',
      as: 'style',
      onload: 'this.rel="stylesheet";this.onload=null'
    });
  });
});

describe('parseComponentTags()', () => {
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

    expect(parseComponentTags(code)).toMatchSnapshot();
  });
});

describe('parseComponent()', () => {
  it('should parse component and return a componentTree - Sample.abell', () => {
    const componentTree = parseComponent(
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
    const componentTree = parseComponent(
      path.join(__dirname, 'resources', 'Parent.abell'),
      {
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
    expect(componentTree.scripts.length).toBe(0);
  });
});
