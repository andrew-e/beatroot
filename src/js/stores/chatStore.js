var Reflux = require('reflux');
var Actions = require('../actions/actions.js');
var socket = require('../socket');

var ChatStore = Reflux.createStore({
  init: function() {
    this.listenTo(Actions.chat, this.sendChat);
    var self = this;
    socket.on('chat', function(message) {
      console.log(message);
      self.trigger(message);
    });
  },

  sendChat: function(msg) {
    console.log('emitting' + msg);
    socket.emit('chat', {author: 'test', text: msg});
  }
});

module.exports = ChatStore;
