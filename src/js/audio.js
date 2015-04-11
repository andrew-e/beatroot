var $ = require('jquery');

var context = new AudioContext;
var startTime = context.currentTime + 0.005;
var noteTime = 0;
var tempo = 60;
var rhythmIndex = 0;

function schedule() {
  var time = context.currentTime - startTime;
  // During this current running of schedule 
  // look forward by 0.2
  // 0.2 acts as a schedule ahead time
  while (noteTime < time + 0.2) {
    var contextPlayTime = noteTime + startTime;
    // Examine dom for active pads at the currently
    // considered rhythmIndex and schedule 
    $('.drum-machine tbody').children().each(function(i) {
      if ($(this).children().eq(rhythmIndex).hasClass('active')) {
        scheduleNote(i, contextPlayTime);
      }
    });
    // TODO: Update UI? 
    advanceNote();
  }
  requestAnimationFrame(schedule);
}

function scheduleNote(row, time) {
  // TODO: generate different frequency based on row
  var oscillator = context.createOscillator();
  oscillator.frequency.value = 200;
  oscillator.connect(context.destination);
  oscillator.start(time);
  oscillator.stop(time + (60 / tempo) * 0.25);
}

function advanceNote() {
  var secondsPerBeat = 60 / tempo;
  // We advance by 1/16 note (0.25) each time
  noteTime += 0.25 * secondsPerBeat;

  rhythmIndex++;
  if (rhythmIndex == 16) {
    rhythmIndex = 0;
  }
}

module.exports = schedule;
