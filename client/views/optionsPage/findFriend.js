Template.findFriend.events({
  'submit #find-user': function(e, t) {
    e.preventDefault();
    t.find('#find-user-submit').disabled = true;
    function tryFriendship(result) {
      if (result) {
        Meteor.call('requestFriendship', result, function(err, res) {
          if (err) {
            console.log(err);
            t.find('#find-user-submit').disabled = false;
          } else {
            alert('Friendship requested! A request was sent to '
            + result.profile.username + '!');
            t.find('#find-user-submit').disabled = false;
          }
        });
      } else {
        alert("Sorry, we couldn't find that user.");
        t.find('#find-user-submit').disabled = false;
      }
    };
    var searchTerm = t.find('#search-term').value
    if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,12})$/.test(searchTerm)) {
      Meteor.call('checkForEmail', searchTerm.toLowerCase(), function(error, result) {
        if (error) {
          console.log(error);
          t.find('#find-user-submit').disabled = false;
        } else {
          tryFriendship(result);
        }
      });
    } else {
      Meteor.call('checkForUsername', searchTerm, function(error, result) {
        if (error) {
          console.log(error);
          t.find('#find-user-submit').disabled = false;
        } else {
          tryFriendship(result);
        }
      });
    }
  }
});
