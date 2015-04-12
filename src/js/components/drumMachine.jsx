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
  mixins: [Reflux.listenTo(DrumStore,"update")],
  getInitialState: function() {
    return {
      pads: []
    };
  },
  update: function(padState) {
    this.setState({pads: padState});
  },
  render: function() {
    var rows = [];
    var size = this.props.size;
    for (var i = 0; i < size; i++){
      rows.push(<Row key={i} rowId={i} padsOn={this.state.pads} size={size} />);
    }
    return (
      <table className="drum-machine">
        {rows}
      </table>
    );
  }
});

var Row = React.createClass({
  render: function() {
    var padsOn= this.props.padsOn;
    var size = this.props.size;
    var k = size * this.props.rowId;
    var row = [];
    for (var i = k; i < k+size; i++)
      row.push(<Pad key={i} id={i} padIsOn={padsOn[i]}/>);
    return (
      <tr id={this.props.rowId}>
        {row}
      </tr>
    );
  }
});

var Pad = React.createClass({
  handleClick: function() {
    Actions.togglePad(this.props.id);
  },
  render: function() {
    var active = this.props.padIsOn ? "active" : "";
    return (
      <td className={active} id={this.props.id} onClick={this.handleClick}></td>
    );
  }
});

module.exports = DrumMachine;
