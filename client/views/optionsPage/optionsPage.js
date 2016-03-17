Template.options.created = function() {
  this.searchExpanded = new ReactiveVar(false),
  this.termsExpanded = new ReactiveVar(false),
  this.privacyExpanded = new ReactiveVar(false),
  this.contactsExpanded = new ReactiveVar(false),
  this.blockExpanded = new ReactiveVar(false),
  this.logoutExpanded = new ReactiveVar(false);
};

Template.options.events({
  'click #search-title': function(e, t) {
    t.searchExpanded.set(!t.searchExpanded.get());
  },
  'click #block-title': function(e, t) {
    t.blockExpanded.set(!t.blockExpanded.get());
  },
  'click #contacts-title': function(e, t) {
    t.contactsExpanded.set(!t.contactsExpanded.get());
  },
  'click #logout-title': function(e, t) {
    t.logoutExpanded.set(!t.logoutExpanded.get());
  },
  'click #contact-us': function() {
    function openContactUsEmail() {
      deviceEmail.open({
        to: ['support@XXXX.com'],
        subject: '',
        body:    '',
        isHtml:  false
      });
    };
    openContactUsEmail();
  }
});

Template.options.helpers({
  searchOpen: function() {
    return (Template.instance().searchExpanded.get());
  },
  contactsOpen: function() {
    return (Template.instance().contactsExpanded.get());
  },
  blockOpen: function() {
    return (Template.instance().blockExpanded.get());
  },
  logoutOpen: function() {
    return (Template.instance().logoutExpanded.get());
  }
});
