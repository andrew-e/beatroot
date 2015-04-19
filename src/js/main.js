var React = require('react');
var Reflux = require('reflux');
var PadApp = require('./components/App.jsx');
var io = require('./socket');
var audio = require('./audio');

React.render(<PadApp />, document.getElementById('content'));
audio();
