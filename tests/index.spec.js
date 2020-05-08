const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;


const abellRenderer = require('../src/index.js');


const sampleSandbox = {
  $contentList: [
    {name: 'Nice'},
    {name: 'very cool'}
  ]
};
const abellTemplate = fs.readFileSync(path.join(__dirname, 'resources', 'if-input.abell'), 'utf-8');
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'resources', 'should-output.html'), 'utf-8');

describe('abellRenderer', () => {

  it('render() should output given htmlTemplate on given abellTemplate', () => {
    expect(
      abellRenderer
        .render(
          abellTemplate, 
          sampleSandbox, 
          {basePath: path.join(__dirname, 'resources')}
        )
      )
      .to.equal(htmlTemplate)
  });

})