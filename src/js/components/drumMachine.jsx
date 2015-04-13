var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/actions.js');
var DrumStore = require('../stores/drumStore.js');
var ChatStore = require('../stores/chatStore.js');

var DrumMachine = React.createClass({
  render: function(){
    return (
      <div>
        <main>
          <Drums size={16} />
        </main>
        <aside>
          <Chat />
        </aside>
      </div>
    );
  }
});

var ChatMessage = React.createClass({
  render: function(){
    var msg = this.props.message;
    return (
      <li className="chat-item">
        <h4 className="chat-author">{msg.author}</h4>
        <div className="chat-text">{msg.text}</div>
      </li>
    );
  }
});

var Chat = React.createClass({
  mixins: [Reflux.listenTo(ChatStore,"append")],
  getInitialState: function() {
    return {messages: []};
  },
  append: function(message) {
    console.log('appending' + message);
    var messages = this.state.messages;
    messages.push(message);
    this.setState({messages: messages});
    console.log('chatstate: ' + this.state.messages);
  },
  render: function() {
    var chatMessages = this.state.messages.map(function(msg){
      return (
        <ChatMessage message = {msg} />
      );
    });
    return(
      <div>
        <h1>Drum Machine</h1>
        <p>A collaborative drum machine built with React, Reflux, Node, SocketIO and Web Audio API</p>
        <ul className="chat">
          {chatMessages}
        </ul>
        <Input />
      </div>  
    );
  }
});

var Input = React.createClass({
  getInitialState: function() {
    return { text: '' };
  },

  render: function() {
    return (
      <textarea className="chat-input" value={this.state.text} onChange={this.onChange} onKeyDown={this.onEnter} />
    );
  },
  
  onChange: function(event, value) {
    this.setState({text: event.target.value});
  },

  onEnter: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      var text = this.state.text.trim();
      if (text) {
        Actions.chat(text);
      }
      this.setState({text: ''});
    }
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
