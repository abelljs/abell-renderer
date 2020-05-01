const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;


const abellRenderer = require('../src/index.js');


const sampleSandbox = {
  $contentList: [
    {name: 'Nice'},
    {name: 'very cool'}
  ],
  globalMeta: {
    siteName: 'This is my siteName',
    name: 'This is my name',
    twitter: 'saurabhcodes'
  }
};
const abellTemplate = fs.readFileSync(path.join(__dirname, 'resources', 'sample.abell'), 'utf-8');
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'resources', 'should-output.html'), 'utf-8');

describe('abellRenderer', () => {

  it('render() should output given htmlTemplate on given abellTemplate', () => {
    expect(abellRenderer.render(abellTemplate, sampleSandbox))
      .to.equal(htmlTemplate)
  });

})