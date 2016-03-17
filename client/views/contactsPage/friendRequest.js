Template.friendRequest.events({
  'click .accept-friendship-button': function(e, t){
    Meteor.call('findUser', this._id, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        Meteor.call('makeFriendship', user, function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  },
  'click .reject-friendship-button': function(e, t){
    Meteor.call('rejectFriendRequest', this._id, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
});
