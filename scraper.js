'use strict';

const md5       = require('md5'),
      numeral   = require('numeral'),
      extralife = require('extra-life-api');

const POLL_INTERVAL = 30 * 1000;

let currentTimeout = null;

module.exports = function(nodecg) {
  nodecg.log.info('Polling donations every %d seconds...', POLL_INTERVAL / 1000);

  let   lockPoll  = false;

  const extraLifeId      = nodecg.Replicant('extralife-id', { defaultValue: 0 }), //348598
        extraLifeTeamId  = nodecg.Replicant('extralife-team-id', { defaultValue: 0 }), // 44208
        teamGoal         = nodecg.Replicant('team-goal', { defaultValue: 0, persistent: false }),
        teamRaised       = nodecg.Replicant('team-raised', { defaultValue: 0, persistent: false }),
        yourGoal         = nodecg.Replicant('your-goal', { defaultValue: 0, persistent: false }),
        yourRaised       = nodecg.Replicant('your-raised', { defaultValue: 0, persistent: false }),
        donations        = nodecg.Replicant('donations', { defaultValue: [], persistent: false }),
        lastSeenDonation = nodecg.Replicant('last-seen-donation', { defaultValue: null, persistent: false });

  extraLifeId.on('change', function() {
    donations.value = [];
    yourRaised.value = 0;
    yourGoal.value = 0;
    lastSeenDonation.value = null;

    update();
  });

  extraLifeTeamId.on('change', function() {
    donations.value = [];
    teamRaised.value = 0;
    teamGoal.value = 0;
    lastSeenDonation.value = null;
    update();
  });


  // Get initial data
  update();

  function update() {
    (async () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      if (lockPoll) {
        return;
      }

      nodecg.log.info(`Polling for ${extraLifeId.value} - ${extraLifeTeamId.value}`)

      lockPoll = true;

      currentTimeout = null;

      if (!extraLifeId.value) {
        currentTimeout = setTimeout(update, POLL_INTERVAL);
        return;
      }

      // First get donations
      // Convert Donation to schema

      // Then get team and goal information

      const remoteDonations = await extralife.getUserDonations(extraLifeId.value, 100);

      donations.value = remoteDonations.donations;

      const userInfo  = await extralife.getUserInfo(extraLifeId.value);

      yourRaised.value = userInfo.sumDonations;
      yourGoal.value = userInfo.fundraisingGoal;

      if (extraLifeTeamId.value) {
        const teamInfo = await extralife.getTeamInfo(extraLifeTeamId.value);

        teamGoal.value = teamInfo.fundraisingGoal;
        teamRaised.value = teamInfo.sumDonations;

        // numDonations for total # of donations
      }

      currentTimeout = setTimeout(update, POLL_INTERVAL);
      //
      //
      // request(participantUrl + personId + donationsUrl, function(err, response, data) {
      //
      //     var stop = false,
      //         temporary = [];
      //
      //     data.forEach(function(donation) {
      //       talliedTotal += (donation.amount * 1);
      //
      //       if (stop) {
      //         return;
      //       }
      //
      //       var hashed = md5(donation.amount + donation.createdDateUTC + donation.displayName + donation.message);
      //       donation.id = hashed;
      //       donation.amount = donation.amount ? numeral(donation.amount).format('$0,0.00') : '';
      //
      //       if (hashed === lastSeenDonation.value) {
      //         stop = true;
      //         return;
      //       }
      //       temporary.unshift(donation);
      //     });
      //
      //     //temporary = temporary.slice(0, stutter);
      //
      //     temporary.forEach(function(donation) {
      //       donations.value.array.push(donation);
      //     });
      //
      //     lastSeenDonation.value = donations.value.array.length > 0 ? donations.value.array[donations.value.array.length - 1].id : null;
      //
      //     if (talliedTotal > yourRaised.value) {
      //       yourRaised.value = talliedTotal;
      //     }
      //   }

    })();
  }
};
