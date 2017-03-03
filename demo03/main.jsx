const React = require('react');  //webpack里you自己的一套require的逻辑 ＝＝》 是nodejs模块引入方式的superset超集
const ReactDOM = require('react-dom');

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.querySelector('#wrapper')
);
