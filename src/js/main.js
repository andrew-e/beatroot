var React = require('react');
var Reflux = require('reflux');
var DrumMachine = require('./components/drumMachine.jsx');
var io = require('./socket');

React.render(<DrumMachine />, document.getElementById('content'));

