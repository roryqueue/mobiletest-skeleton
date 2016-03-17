Template.usernamePrompt.events({
  'submit #gets-username': function(e, t) {
    e.preventDefault();
    t.find('#up-signup').disabled = true;

    var username = t.find('#username').value.toLowerCase()
    var currentUser = Meteor.user()

    if (/^[a-z0-9_]{3,16}$/.test(username)) {
      Meteor.call('checkForUsername', username, function(error, result) {
        if (error) {
          console.log(error);
          t.find('#up-signup').disabled = false;
        } else if (result) {
          alert("Sorry, that username is taken! Try another.");
          t.find('#up-signup').disabled = false;
        } else {
          Meteor.call('assignUsername', username, function(error, result) {
            if (error) {
              console.log(error);
              t.find('#up-signup').disabled = false;
            } else {
              if (Meteor.isCordova){
                Push.setUser();
                if (!( ('profile' in currentUser)
                  && ('myContacts' in currentUser.profile)
                  && currentUser.profile.myContacts
                  && currentUser.profile.myContacts.length > 0)) {
                  deviceContacts.find(
                    ["*"],
                    function(contacts) {
                      Meteor.call("uploadContacts", contacts, function(err, result) {
                        if (err) {
                          console.log(err);
                        }
                      });
                    },
                    function(err) {
                      console.log(err);
                    }
                  );
                }
              }
              Router.go('contactList');
            }
          });
        }
      });
    } else {
      alert(
        "Sorry! Usernames can only contain lower-case letters, numbers,"
        + "and underscores. They must be 3-16 characters."
      );
      t.find('#up-signup').disabled = false;
    }

  },
  'click #retry-login': function(e, t) {
    Meteor.call('deleteCurrentUser');
  }
});
