var React = require('react');
var Reflux = require('reflux');
var ChatStore = require('../stores/chatStore.js');
var Actions = require('../actions/actions.js');

var Sidebar = React.createClass({

  render: function() {
    return (
      <div className="side-bar">
        <Logo />
        <Chat />
        <Footer />
      </div>
    );
  }

});

var Logo = React.createClass({

  render: function() {
    return (
      <div className="logo">
        <h1>BeatRoot</h1>
        <h2>A collaborative drum machine built with React, Reflux, SocketIO, NodeJS and the Web Audio API.</h2>
      </div>
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
    var chatMessages = this.state.messages.map(function(msg, i){
      return (
        <ChatMessage message={msg} key={i} />
      );
    });
    return(
      <div className="chat-container">
        <ul ref="msgList" className="chat">
          {chatMessages}
        </ul>
        <ChatInput />
      </div>
    );
  }

});

var ChatInput = React.createClass({

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

var Footer = React.createClass({

  render: function() {
    return (
      <h3>2015 - <a href="http://www.github.com/wpote/drummachine">Github</a></h3>
    );
  }

});

module.exports = Sidebar;
