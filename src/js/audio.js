var $ = require('jquery');

var context = new AudioContext;
var startTime = context.currentTime + 0.005;
var noteTime = 0;
var tempo = 60;
var rhythmIndex = 0;
var attackTime = 0.1;

function schedule() {
  var time = context.currentTime - startTime;
  // During this current running of schedule 
  // look forward by 0.2
  // 0.2 acts as a schedule ahead time
  while (noteTime < time + 0.2) {
    var contextPlayTime = noteTime + startTime;
    // Examine DOM for active pads at current
    // rhythmIndex and schedule notes 
    // TODO: cache these jquery refs?
    $('.drum-table tbody').children().each(function(i) {
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
  // TODO: Generic note generation
  var BbMinor = [233.08, 261, 277.18, 311.13, 
      349.23, 369.99, 415.30, 466.16, 523.25, 
      554.37, 622.25, 698.46, 739.99, 830.61, 
      932.33, 1046.5];
  var oscillator = context.createOscillator();
  var gain = context.createGain();
  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(1, time + attackTime);
  gain.gain.linearRampToValueAtTime(0, time + (60 / tempo) * 0.25);

  oscillator.frequency.value = BbMinor[row];
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(time);
  //oscillator.stop(time + (60 / tempo) * 0.25);
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
