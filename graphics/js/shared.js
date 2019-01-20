/*global rivets,numeral*/
'use strict';

const data = {
  gameName: '',
  nextGame: '',
  timer: '',
  streamName: '',
  donationLink: '',
  streamTotal: '',
  teamTotal: ''
};

const currentGame          = nodecg.Replicant('current-game'),
      nextGame             = nodecg.Replicant('next-game'),
      timerDisplayValue    = nodecg.Replicant('timerDisplayValue', { defaultValue : 24 * 60 * 60 }),
      timerNegative        = nodecg.Replicant('timerNegative', { defaultValue : false }),
      streamName           = nodecg.Replicant('stream-name', { defaultValue: '' }),
      donationLink         = nodecg.Replicant('donation-link', { defaultValue: '' }),
      teamRaised           = nodecg.Replicant('team-raised', { defaultValue: 0, persistent: false }),
      yourRaised           = nodecg.Replicant('your-raised', { defaultValue: 0, persistent: false }),
      donations            = nodecg.Replicant('donations', { defaultValue: [], persistent: false }),
      showDonationComments = nodecg.Replicant('show-donation-comments', { defaultValue : true });

showDonationComments.on('change', newValue => {
  if (newValue === false) {
    $('#donation-container').addClass('hide-comments');
  } else {
    $('#donation-container').removeClass('hide-comments');
  }
});

streamName.on('change', newVal => {
  data.streamName = newVal;
});

donationLink.on('change', newVal => {
  data.donationLink = newVal;
});

yourRaised.on('change', newVal => {
  data.streamTotal = numeral(newVal).format('$0,0.00');
});

teamRaised.on('change', newVal => {
  data.teamTotal = numeral(newVal).format('$0,0.00');
});

currentGame.on('change', newVal => {
  data.gameName = newVal;
});

nextGame.on('change', newVal => {
  data.nextGame = newVal;
});

timerDisplayValue.on('change', newVal => {
  let time = numeral(newVal).format('00:00:00');

  if (timerNegative.value) {
    time = '-' + time;
  }

  data.timer = time;
});

timerNegative.on('change', newValue => {
  let tm = data.timer;

  if (newValue && tm.length > 0 && tm[0] !== '-') {
    data.timer = '-' + tm;
  } else if (!newValue && tm.length > 0 && tm[0] === '-') {
    data.timer = tm.slice(1);
  }
});
// 
// let numDisplayed = 0,
//     lastSeenDonation = null,
//     pollInterval = (30 * 10),
//     initial = true;
//
// var parseDonations = function(newValue) {
//   var newArray = newValue;
//
//   if (!Array.isArray(newValue)) {
//     return;
//   }
//
//   if (newArray.length === 0 || newValue.clear) {
//     $('#donation-container').find('.donation').remove();
//     lastSeenDonation = null;
//     numDisplayed = 0;
//     initial = true;
//   }
//
//   var pass = false;
//   var temporary = [];
//   for(var i = newArray.length -1; i>= 0; i--) {
//     var donation = newArray[i];
//     if (donation.id === lastSeenDonation || pass) {
//       pass = true;
//       continue;
//     } else {
//       temporary.unshift(donation);
//     }
//   }
//
//   var intervals = (temporary.length > 0 && temporary.length <= pollInterval) ?
//                     Math.floor(pollInterval / temporary.length) : 1;
//   var j = 0;
//   var bucket = temporary.length > pollInterval ? Math.ceil(temporary.length / pollInterval) : 1;
//   var bucketCounter = 1;
//
//   temporary.forEach(function(donation) {
//     numDisplayed++;
//
//     if(!initial) {
//       setTimeout(function() {
//
//         $('<div style="display: none;" class="donation">' +
//           '<span class="donor_name">' + (donation.displayName || 'Anonymous') + '</span>' +
//           '<span class="donor_ammount">' +  donation.amount + '</span>' +
//           '<span class="donor_text">' + (donation.message || '') + '</span>' +
//         '</div>').prependTo('#donation-container').fadeIn();
//
//         if (numDisplayed >= 21) {
//           $('#donation-container').find('.donation').last().remove();
//         }
//       }, j * intervals * 100);
//     } else {
//       $('<div style="display: none;" class="donation">' +
//         '<span class="donor_name">' + (donation.displayName || 'Anonymous') + '</span>' +
//         '<span class="donor_ammount">' +  donation.amount + '</span>' +
//         '<span class="donor_text">' + (donation.message || '') + '</span>' +
//       '</div>').prependTo('#donation-container').fadeIn();
//
//       if (numDisplayed >= 21) {
//         $('#donation-container').find('.donation').last().remove();
//       }
//     }
//
//     if ((bucketCounter % bucket) === 0) {
//       j++;
//     }
//
//     bucketCounter++;
//   });
//
//   initial = false;
//   lastSeenDonation = newArray[newArray.length - 1].id;
// };
//
// donations.on('change', newValue => {
//   parseDonations(newValue);
// });

$(document).ready(function() {
  rivets.bind($('#container'), { data: data });
});
