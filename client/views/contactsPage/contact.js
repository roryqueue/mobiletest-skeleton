Template.contact.helpers({
	formattedName: function(name) {
		if (name.length > 18) {
			return name.slice(0,15) + '...';
		} else {
			return name;
		}
	}
});

Template.contact.events({
	'click .contact-row': function(e, t){
		t.find('#' + this.email).parent().toggleClass(selected-contact, deselected-contact);
	}
});
