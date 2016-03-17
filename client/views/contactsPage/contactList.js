Template.contactList.created = function() {
	this.contactCounter = new ReactiveVar(20);
}

Template.contactList.helpers({
	friends: function() {
		if (Meteor.user()) {
			return Meteor.user().profile.myFriends.sort(function(a,b){
				if (a.nameKey < b.nameKey) {
					return -1;
				}
				if (a.nameKey > b.nameKey) {
					return 1;
				}
				return 0;
			});
		} else {
			return null;
		}
	},

	goodContacts: function() {
		if (Meteor.user()) {
			return Meteor.user().profile.myContacts.filter( function(contact) {
					return contact.email && contact.fullName;
			}).filter( function(a) {
        return a.nameKey && a.phoneNumber && a.email > -1 ? 1 : 0;
			}).sort( function(a, b) {
				if (a.nameKey < b.nameKey) {
					return -1;
				} else if (a.nameKey > b.nameKey) {
					return 1;
				} else {
					return 0;
				}
			}).slice(0, Template.instance().contactCounter.get());
		} else {
			return null;
		}
	},

	recentContacts: function() {
		if (Meteor.user()) {
			return Meteor.user().profile.myContacts.filter( function(contact) {
				return contact.email && contact.fullName;
			}).filter( function(contact) {
				return 'recent' in contact;
			}).sort( function(a, b) {
				if (a.nameKey < b.nameKey) {
					return -1;
				} else if (a.nameKey > b.nameKey) {
					return 1;
				} else {
					return 0;
				}
			}).slice(0, Template.instance().contactCounter.get());
		} else {
			return null;
		}
	},

	friendRequests: function() {
		return Meteor.user().profile.friendRequests;
	},

	anyFriends: function() {
		if (Meteor.user()) {
			return (Meteor.user().profile.myFriends.length > 0);
		} else {
			return null;
		}
	},

	anyFriendRequests: function() {
		if (Meteor.user()) {
			return (Meteor.user().profile.friendRequests.length > 0);
		} else {
			return null;
		}
	},

	anyContacts: function() {
		if (Meteor.user()) {
			return (Meteor.user().profile.myContacts.length > 0);
		} else {
			return null;
		}
	},

	moreContacts: function() {
		if (Meteor.user()) {
			return (
				Template.instance().contactCounter.get()
				<
				Meteor.user().profile.myContacts.map( function(contact) {
					if (contact.email) {
						return contact;
					}
				}).length
			);
		} else {
			return null;
		}
	}
});

Template.contactList.events({
	'change #select-all-friends': function(e,t) {
		if ($('#select-all-friends').is(':checked')) {
			$('.friend').prop('checked', true);
		} else {
			$('.friend').prop('checked', false);
		}
	},
	'change #selectAllContacts': function(e,t) {
		if ($('#selectAllContacts').is(':checked')) {
			$('.contact').prop('checked', true);
		} else {
			$('.contact').prop('checked', false);
		}
	},
	'click #load-more-contacts': function(e,t) {
		e.preventDefault();

		t.contactCounter.set(t.contactCounter.get() + 20);
	}
});
