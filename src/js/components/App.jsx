var React = require('react');
var Actions = require('../actions/actions.js');
var PadGrid = require('./PadGrid.jsx');
var Sidebar = require('./Sidebar.jsx');

var PadApp = React.createClass({

  render: function(){
    return (
      <div className="app-container">
        <main>
          <PadGrid size={16} />
        </main>
        <aside>
          <Sidebar />
        </aside>
        <NamePopup />
      </div>
    );
  }

});

var NamePopup = React.createClass({

  getInitialState: function(){
    return {
      text: '',
      hide: false
    };
  }, 

  onChange: function(event) {
    this.setState({text: event.target.value});
  },

  onEnter: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      var text = this.state.text.trim();
      if (text) {
        Actions.setName(text);
      }
      this.setState({hide: true});
    }
  },

  render: function(){
    var c = this.state.hide ? "hidden" : "overlay";
    return (
      <div className={c}>
        <div className="overlay-msg">
          <input type="text" onKeyDown={this.onEnter} value={this.state.text} onChange={this.onChange} placeholder="Enter Your Name" autoFocus />
        </div>
      </div>
    );
  }

});

module.exports = PadApp;
