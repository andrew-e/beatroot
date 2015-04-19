var React = require('react');
var Reflux = require('reflux');
var DrumStore = require('../stores/drumStore.js');
var Actions = require('../actions/actions.js');

var PadGrid = React.createClass({
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
      <div id="drum-container">
        <table className="drum-table">
          {rows}
        </table>
      </div>
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

  handleClick: function(event) {
    Actions.togglePad(this.props.id);
  },

  render: function() {
    var active = this.props.padIsOn ? "active" : "";
    return (
      <td className={active} id={this.props.id} onClick={this.handleClick}></td>
    );
  }

});

module.exports = PadGrid;
