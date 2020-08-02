const expect = require('chai').expect;

const {
  parseAttribute,
  parseComponentTags
} = require('../src/component-parser.js');

describe('parseAttribute()', () => {
  it('should turn string attributes into object', () => {
    expect(parseAttribute('inlined bundle="app.js"')).to.eql({
      inlined: true,
      bundle: 'app.js'
    });
  });

  it('should allow inlined=false in attribute', () => {
    expect(parseAttribute('inlined=false')).to.eql({
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
    ).to.eql({
      rel: 'preload',
      as: 'style',
      onload: 'this.rel="stylesheet";this.onload=null'
    });
  });
});

describe('parseComponentTags()', () => {
  it('should turn string attributes into object', () => {
    const code = `
    var Nav = require('./components/Nav.abell');
    <div>
      <Nav 
        props={
          foo: 'bar'
        }
      />
    </div>
    `;

    expect(
      parseComponentTags(code)
        .trim()
        .replace(/\s|\n|\r/g, '')
    ).to.equal(
      `
      var Nav = require('./components/Nav.abell');
      <div>{{ Nav({foo: 'bar'}).renderedHTML }}</div>
      `
        .trim()
        .replace(/\s|\n|\r/g, '')
    );
  });
});
