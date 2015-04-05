var Reflux = require('reflux');
var Actions = require('../actions/actions.js');
var socket = require('../socket');

var DrumsStore = Reflux.createStore({
  init: function() {
    this.listenTo(Actions.togglePad, this.onTogglePad);
    var self = this;
    socket.on('setDrumState', function(padState){
      console.log(padState);
      var pads = padState.reduce(function(a, b) {
        return a.concat(b);
      });
      pads.forEach(function(cur, i){
        self.trigger(cur, i);
      });
    });
    socket.emit('getDrumState');
  },
  onTogglePad: function(pos) {
    console.log('sending trigger on: ' + pos);
    socket.emit('toggle', pos);
    //this.trigger(pos);
  }
});

module.exports = DrumsStore;
