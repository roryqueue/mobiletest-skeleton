Template.blockUser.events({
  'submit #block-user': function(e, t) {
    e.preventDefault();
    t.find('#block-user-submit').disabled = true;
    function blockUser(thatUser) {
      if (thatUser) {
        Meteor.call('blockUser', thatUser, function(err, res) {
          if (err) {
            console.log(err);
            t.find('#block-user-submit').disabled = false;
          } else {
            alert(
              'You have now blocked ' + thatUser.profile.username +
              '. This user can no longer find or contact your account.'
            );
            t.find('#block-user-submit').disabled = false;
          }
        });
      } else {
        alert("Sorry, we couldn't find that user. Please contact support.");
        t.find('#block-user-submit').disabled = false;
      }
    };
    var searchTerm = t.find('#search-term').value;
    if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,12})$/.test(searchTerm)) {
      Meteor.call('checkForEmail', searchTerm.toLowerCase(), function(error, result) {
        if (error) {
          console.log(error);
          t.find('#block-user-submit').disabled = false;
        } else {
          blockUser(result);
        }
      });
    } else {
      Meteor.call('checkForUsername', searchTerm, function(error, result) {
        if (error) {
          console.log(error);
          t.find('#block-user-submit').disabled = false;
        } else {
          blockUser(result);
        }
      });
    }
  }
});
