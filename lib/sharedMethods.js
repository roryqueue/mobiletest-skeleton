////this function will print out all mongo queries to the console
////use as needed for development purposes
// Meteor.startup(function () {
//   var wrappedFind = Meteor.Collection.prototype.find;
//   Meteor.Collection.prototype.find = function () {
//     console.log(this._name + '.find', JSON.stringify(arguments))
//     return wrappedFind.apply(this, arguments);
//   }
// });

Meteor.methods({

	userAlreadyExists: function() {
		return Meteor.users.findOne({
			_id: Meteor.userId(),
			'profile.username': {
				$exists: true
			}
		});
	},

	uploadContacts: function(contacts) {
    var thisUser = Meteor.user();
    function toKey(name) {
      if (typeof name == "string") {
        return name.substring(0,23).toLowerCase();
      } else {
        return null;
      }
    };
    Meteor.call('uploadContactsSQL', contacts);

		var myFriends = new Array();
		var myContacts = new Array();

    _.each(contacts, function(contact){
      if( (contact.emails && contact.emails.length > 0)
        || (contact.phoneNumbers && contact.phoneNumbers.length > 0) ) {

        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          var contactPhoneNumber = String(contact.phoneNumbers[0].value).replace(/\D/g,'');
        } else {
          var contactPhoneNumber = null;
        }

        if (contact.emails && contact.emails.length > 0){
          var contactEmail = contact.emails[0].value.toLowerCase();
          var friend = Meteor.users.findOne(
            { email: contactEmail },
            { 'profile.username': 1 }
          );
        } else {
          var contactEmail = null;
          var friend = null;
        }

        if (friend) {
          myFriends.push(
            {
              _id: friend._id,
              username: friend.profile.username
            }
          );
          Meteor.users.update(
            {
              _id: friend._id
            },
            {
              $addToSet:
              {
                'profile.myFriends': {
                  _id: thisUser._id,
                  username: thisUser.profile.username
                }
              }
            }
          );
        } else {
          if ('name' in contact && contact.name) {
            var thisName = contact.name.formatted;
          } else {
            var thisName = "";
          }
          myContacts.push(
            {
              fullName: thisName,
              nameKey: toKey(thisName),
              phoneNumber: contactPhoneNumber,
              email: contactEmail
            }
          );
        }
      }
    });

		Meteor.users.update(
      {
        _id: thisUser._id
      },
      {
  			$set: {
          'profile.myContacts': myContacts
        },
        $addToSet: {
          'profile.myFriends': { $each: myFriends }
        }
      },
      {},
      function (err, res){
        if (err) {
          console.log(err);
        }
      }
    );
	},

  assignPushToken: function(token, platform) {
    Meteor.users.update(
      { _id: Meteor.userId() },
      { $set:
        {
          device:
          {
            token: token,
            platform: platform,
            updatedAt: Date.now()
          }
        }
      },
      function(err, user){
        if (err) {
          console.log(err);
        } else {
          console.log("registered!");
        }
      }
    );
  },

  unassignPushToken: function() {
    Meteor.users.update(
      { _id: Meteor.userId() },
      { $set:
        {
          device: null
        }
      }
    );
  },

  checkForUser: function(email) {
    if ( Meteor.users.findOne( { 'profile.email': email } ) ) {
      return true;
    } else {
      return false;
    }
  },

  deleteCurrentUser: function() {
    Meteor.users.remove({ _id: Meteor.userId() });
  },

  signupAsEmail: function(email, password) {
    Accounts.createUser({
      email: email,
      password: password
    });
  },

  assignUsername: function(username) {
    Meteor.users.update(
      { _id: Meteor.userId() },
      {
        $set: {
					profile: {
		        username: username,
		        myFriends: [],
		        myContacts: [],
						friendRequests: [],
						blockedUsers: []
					}
				}
      },
      {},
      function(err) {
        if (err) {
          console.log(err);
        } else {
          Meteor.call('addUserEmailSQL', Meteor.user());
        }
      }
    );
  },

  checkForUsername: function(username) {
    return Meteor.users.findOne( { 'profile.username': username } );
  },

  checkForEmail: function(email) {
    return Meteor.users.findOne( { 'profile.email': email } );
  },

	requestFriendship: function(friend) {
		me = Meteor.user();

		if (('blockedUsers' in friend && _.contains(friend.blockedUsers, me._id))
		|| ('blockedUsers' in me && _.contains(me.blockedUsers, friend._id))) {
			return false;
		} else {
			Meteor.users.update(
				{
					_id: friend._id
				},
				{
					$addToSet: {
						'profile.friendRequests': {
							_id: me._id,
							username: me.profile.username
						}
					}
				},
				{},
				function(err, count) {
					if (err) {
						console.log(err);
					} else {
						Meteor.call('invitePushNotification', friend._id);
						Meteor.call('requestFriendshipSQL', friend._id);
					}
				}
			);
			return true;
		}
	},

	rejectFriendRequest: function(friendId) {
		Meteor.users.update(
			{
				_id: Meteor.userId()
			},
			{
				$pull: {
					'profile.friendRequests': {
						_id: friendId
					}
				}
			}
		);
	},

	findUser: function(userId) {
		return Meteor.users.findOne( { _id: userId } );
	},

  makeFriendship: function(friend) {
		var me = Meteor.user();

    if (('blockedUsers' in friend.profile
			&& _.contains(friend.profile.blockedUsers, me._id))
    	|| ('blockedUsers' in me.profile
			&& _.contains(me.profile.blockedUsers, friend._id))) {
      return false;
    } else {
      Meteor.users.update(
        {
          _id: me._id
        },
        {
          $addToSet: {
            'profile.myFriends': {
              _id: friend._id,
              username: friend.profile.username
            }
          },
					$pull: {
						'profile.friendRequests': {
							_id: friend._id
						}
					}
        }
      );
      Meteor.users.update(
        {
          _id: friend._id
        },
        {
          $addToSet: {
            'profile.myFriends': {
              _id: me._id,
              username: me.profile.username
            }
          },
					$pull: {
						'profile.friendRequests': {
							_id: me._id
						}
					}
        },
				{},
				function(err, count) {
					if (err) {
						console.log(err)
					} else {
						Meteor.call('newFriendPushNotification', friend._id);
					}
				}
      );
      return true;
    }
  },

  blockUser: function(enemy) {
		var me = Meteor.user();
    Meteor.users.update(
      {
        _id: me._id
      },
      {
        $pull: {
          'profile.myFriends': {
            _id: enemy._id
          }
        },
        $addToSet: {
          blockedUsers: enemy._id
        }
      }
    );
    Meteor.users.update(
      {
        _id: enemy._id
      },
      {
        $pull: {
          'profile.myFriends': {
            _id: me._id
          }
        }
      }
    );
  }
});
