var Reflux = require('reflux');
var Actions = require('../actions/actions.js');
var socket = require('../socket');

var username = 'Guest';
var ChatStore = Reflux.createStore({
  init: function() {
    this.listenTo(Actions.chat, this.sendChat);
    this.listenTo(Actions.setName, this.setName);
    var self = this;
    socket.on('chat', function(message) {
      self.trigger(message);
    });
  },

  setName: function(name) {
    username = name;
  },

  sendChat: function(msg) {
    socket.emit('chat', {author: username, text: msg});
  }
});

module.exports = ChatStore;
