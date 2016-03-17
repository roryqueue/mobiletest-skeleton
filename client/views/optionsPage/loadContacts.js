Template.loadContacts.created = function() {
  this.isLoading = new ReactiveVar(false),
  this.loadMessage = new ReactiveVar('');
};
Template.loadContacts.helpers({
  isLoading: function() {
    return Template.instance().isLoading.get();
  },
  loadMessage: function() {
    return Template.instance().loadMessage.get();
  }
});

Template.loadContacts.events({
  'click #add-contacts': function(e, t) {
    if (Meteor.isCordova){
      t.find('#add-contacts').disabled = true;
      t.isLoading.set(true);
      multipleLoadingMessages(
        [
          "Loading friends from contacts............",
          "Finding friends in-App............",
          "Hmmmmmmmmm............"
        ],
        t.loadMessage
      )
      deviceContacts.find(
        ["*"],
        function(contacts) {
          Meteor.call("uploadContacts", contacts, function(err, result) {
            if (err) {
              console.log(err);
              t.isLoading.set(false);
              t.find('#add-contacts').disabled = false;
            } else {
              Router.go('contactList');
            }
          });
        },
        function(err) {
          console.log(err);
          t.isLoading.set(false);
          t.find('#add-contacts').disabled = false;
        }
      );
    } else {
      alert("Can't find device contacts!");
    }
  }
});
