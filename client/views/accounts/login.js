var toggleFlag = function(flag) {
  Session.setDefault(flag, false);
  if(Session.get(flag)) {
    Session.set(flag, false);
  } else {
    Session.set(flag, true);
  }
};

Template.login.created = function() {
  this.isLoading = new ReactiveVar(false),
  this.loadMessage = new ReactiveVar('');
};

Template.login.events({

  'click #facebook-registration': function(e, t){
    e.preventDefault();

    // t.isLoading.set(true);
    t.find('#facebook-registration-submit').disabled = true;
    Meteor.loginWithFacebook({
      requestPermissions: ['email','public_profile', 'user_friends']
    }, function(error) {
      if (error) {
        t.isLoading.set(false);
        t.find('#facebook-registration-submit').disabled = false;
        Router.go('contactList');
        console.log(error);
      } else {
        Meteor.call('userAlreadyExists', function(error, result) {
          if (error) {
            t.isLoading.set(false);
            t.find('#facebook-registration-submit').disabled = false;
            console.log(error)
            Router.go('contactList');
          }
          if (result) {
            Router.go('contactList');
          } else {
            Router.go('usernamePrompt');
          }
        });
      }
    });
  },
	'submit #email-registration': function(e, t){
		e.preventDefault();
    // t.isLoading.set(true);
    function attemptLogin(email, password) {
      Meteor.call('checkForUser', email, function(error, result) {
        if (error) {
          t.isLoading.set(false);
          console.log(error);
          Router.go('contactList');
        } else if (result) {
          Meteor.loginWithPassword(email, password, function(error, result) {
            if (error) {
              t.isLoading.set(false);
              alert(error);
              Router.go('contactList');
            } else {
              if (Meteor.isCordova){
                Push.setUser();
              }
              Router.go('contactList');
            }
          });
        } else {
          signupAs(email, password);
        }
      });
    };

    function signupAs(email, password) {
      Meteor.call('signupAsEmail', email, password, function(error) {
        if (error) {
          t.isLoading.set(false);
          alert(error)
          Router.go('contactList');
        } else {
          Meteor.loginWithPassword(email, password, function(err){
            if (err) {
              t.isLoading.set(false);
              alert(err);
              Router.go('contactList');
            } else {
              if (Meteor.isCordova){
                Push.setUser();
              }
              Router.go('usernamePrompt');
            }
          });
        }
      });
    };

  	var email = t.find('#user-email').value.toLowerCase(),
        password = t.find('#user-pass').value;
    if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,12})$/.test(email) === false) {
      alert("Sorry, that email is invalid!");
      t.isLoading.set(false);
    } else if (/^[\w\[\]`!@#$%\^&*()={}:;<>+'-]{8,}$/.test(password) === false) {
      alert("8 characters or more in your password, please!");
      t.isLoading.set(false);
    } else {
      attemptLogin(email, password);
    }
	},
  'click #email-toggle' : function(e, t){
    toggleFlag('emailSignin');
  }

});

Template.login.helpers({
  emailLogin: function() {
    return (Session.get('emailSignin'));
  },
  isLoading: function() {
    return Template.instance().isLoading.get();
  },
  loadMessage: function() {
    return Template.instance().loadMessage.get();
  }
});
