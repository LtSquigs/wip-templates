'use strict';

const numeral = require('numeral');

module.exports = function(nodecg) {
  nodecg.log.info('Creating countdown timer');

  let timerStartPoint = -1,
      timerInterval   = null;

  const timerValue = nodecg.Replicant('timerValue', { defaultValue : 24 * 60 * 60 }),
        timerDisplayValue = nodecg.Replicant('timerDisplayValue', { defaultValue : 24 * 60 * 60 }),
        timerPaused = nodecg.Replicant('timerPaused', { defaultValue : true, persistent: false  }),
        timerNegative = nodecg.Replicant('timerNegative', { defaultValue : false });

  const startTimer = function() {
    timerStartPoint = Date.now();
    timerPaused.value = false;

    if (timerInterval) {
      clearInterval(timerInterval);
    };

    nodecg.log.info('Starting Timer');
    timerInterval = setInterval(updateTimer, 1000);
  };

  const stopTimer = function() {
    timerPaused.value = true;

    nodecg.log.info('Stopping Timer');
    if (timerInterval) {
      clearInterval(timerInterval);
    };

    timerValue.value = timerDisplayValue.value;

    if (timerNegative.value) {
      timerValue.value = timerValue.value * -1;
    }
  }

  const updateTimer = function() {
    if (!timerStartPoint) {
      return;
    }

    var tempValue = timerValue.value - ((Date.now() - timerStartPoint) / 1000);

    if (tempValue < 0) {
      timerNegative.value = true;
      timerDisplayValue.value = tempValue * -1;
    } else {
      timerNegative.value = false;
      timerDisplayValue.value = tempValue;
    }
  };

  nodecg.listenFor('setTimer', function(time) {
    stopTimer();
    timerValue.value = time;
    timerDisplayValue.value = time < 0 ? (time * -1) : time;
    timerNegative.value = time < 0 ? true : false;
  });

  nodecg.listenFor('startTimer', function() {
    startTimer();
  });

  nodecg.listenFor('stopTimer', function() {
    stopTimer();
  });

  process.on('exit', function() {
    stopTimer();
  })
};
