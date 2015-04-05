var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/actions.js');
var DrumStore = require('../stores/drumStore.js');

var DrumMachine = React.createClass({
  render: function(){
    return (
      <div>
        <Drums size={16} />
        <Chat />
      </div>
    );
  }
});

var Chat = React.createClass({
  render: function() {
    return(
      <div></div>  
    );
  }
});

var Drums = React.createClass({
  render: function() {
    var rows = [];
    for (var i = 0; i < this.props.size; i++) 
      rows.push(<Row key={i} pos={i} size={this.props.size} />);
    return (
      <table className="drum-machine">
        {rows}
      </table>
    );
  }
});

var Row = React.createClass({
  render: function() {
    var size = this.props.size;
    var k = size * this.props.pos;
    var row = [];
    for (var i = k; i < k+size; i++)
      row.push(<Pad key={i} pos={i} />);
    return (
      <tr>
        {row}
      </tr>
    );
  }
});

var Pad = React.createClass({
  mixins: [Reflux.listenTo(DrumStore,"toggleOn")],
  getInitialState: function() {
    return {active: false};
  },
  toggleOn: function(state, p) {
    if (p == this.props.pos)
      this.setState({active: state});
  },
  handleClick: function() {
    Actions.togglePad(this.props.pos);
    this.toggle(this.props.pos);
    this.setState({active: !this.state.active});
  },
  render: function() {
    var active = this.state.active ? "active" : "";
    return (
      <td className={active} onClick={this.handleClick}></td>
    );
  }
});

module.exports = DrumMachine;
