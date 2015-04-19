var React = require('react');
var Reflux = require('reflux');
var Actions = require('../actions/actions.js');
var DrumStore = require('../stores/drumStore.js');
var ChatStore = require('../stores/chatStore.js');

var DrumMachine = React.createClass({
  render: function(){
    return (
      <div className="app-container">
        <main>
          <Drums size={16} />
        </main>
        <aside>
          <Chat />
        </aside>
        <Popup />
      </div>
    );
  }
});

var Popup = React.createClass({
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

var ChatMessage = React.createClass({
  render: function(){
    var msg = this.props.message;
    return (
      <li className="chat-item">
        <h4 className="chat-author">{msg.author}</h4>
        <p>{msg.text}</p>
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
    var messages = this.state.messages;
    messages.push(message);
    this.setState({messages: messages});
  },

  componentDidUpdate: function() {
    this.scrollToBottom();
  },

  scrollToBottom: function() {
    var l = this.refs.msgList.getDOMNode();
    l.scrollTop = l.scrollHeight;
  },
    
  render: function() {
    var chatMessages = this.state.messages.map(function(msg){
      return (
        <ChatMessage message = {msg} />
      );
    });
    return(
      <div className="side-bar">
        <Logo />
        <div className="chat-container">
          <ul ref="msgList" className="chat">
            {chatMessages}
          </ul>
          <Input />
        </div>
        <Footer />
      </div>  
    );
  }
});

var Footer = React.createClass({
  render: function() {
    return (
      <h3>2015 - <a href="http://www.github.com/wpote/drummachine">Github</a></h3>
    );
  }
});

var Logo = React.createClass({
  render: function() {
    return (
      <div className="logo">
        <h1>PotePads</h1>
        <h2>A collaborative drum machine built with React, Reflux, SocketIO, NodeJS and the Web Audio API.</h2>
      </div>
    );
  }
});

var LogoImg = React.createClass({
  render: function() {
    <table>
      <tr><td></td><td className="tdLogoBordered"></td><td></td></tr>
      <tr><td className="tdLogoBordered"></td><td className="tdLogoBordered"></td><td className="tdLogoBordered"></td></tr>
      <tr><td></td><td></td><td className="tdLogoBordered"></td></tr>
    </table>
  }
});

var Input = React.createClass({
  getInitialState: function() {
    return { text: '' };
  },

  render: function() {
    return (
      <textarea className="chat-input" value={this.state.text} onChange={this.onChange} onKeyDown={this.onEnter} autoFocus />
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
        if (text.indexOf("/name") == 0) {
          Actions.setName(text.substring(6,60));
        } else {
          Actions.chat(text);
        }
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
  handleClick: function(event) {
    event.stopPropagation();
    event.preventDefault();
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
