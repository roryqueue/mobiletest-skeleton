Meteor.methods({

  askedPushNotification: function(recipientIds, comment) {
    _.each(recipientIds, function(recipId) {
      Push.send({
        from: '',//this does nothing
        title: 'You have a new Message!',
        text: Meteor.user().profile.username + " said: " + comment,
        query: {
          userId: recipId
        }
      });
    });
  },

  answeredPushNotification: function(recipientId, comment) {
    Push.send({
      from: '',//this does nothing
      title: 'You have a new answer to your Message!',
      text: Meteor.user().profile.username + " said: " + comment,
      badge: 1,
      query: {
        userId: recipientId
      }
    });
  },

  invitePushNotification: function(recipientId) {
    Push.send({
      from: '',//this does nothing
      title: 'You have a new friend request on Message!',
      text: Meteor.user().profile.username + ' sent you a friend request!',
      badge: 1,
      query: {
        userId: recipientId
      }
    });
  },

  newFriendPushNotification: function(recipientId) {
    Push.send({
      from: '',//this does nothing
      title: 'You have a new friend on Message!',
      text: 'You are now friends with ' + Meteor.user().profile.username + ' on Message!',
      badge: 1,
      query: {
        userId: recipientId
      }
    });
  }
});

Push.allow({
  send: function(userId, notification) {
    return true; // Allow all users to send push notes w/ above methodss
  }
});
