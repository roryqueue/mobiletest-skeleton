Template.searchContacts.created = function() {
  this.query = new ReactiveVar('');
};

Template.searchContacts.helpers({
	queryContacts: function() {
		if (Template.instance().query.get()) {
			return Meteor.user().profile.myContacts.filter( function(contact) {
				return contact.email && contact.fullName;
			}).filter( function(contact) {
          return contact.nameKey.indexOf(Template.instance().query.get()) > -1 ? 1 : 0;
			}).sort( function(a, b) {
				if (a.nameKey < b.nameKey) {
					return -1;
				} else if (a.nameKey > b.nameKey) {
					return 1;
				} else {
					return 0;
				}
			}).slice(0, 9);
		} else {
			return null;
		}
	}
});

Template.searchContacts.events({
  'keydown #contact-query': function (e, t) {
    setTimeout(function(){
      t.query.set(t.find('#contact-query').value.toLowerCase());
    }, 1);
  }
});
