Template.options.events({
  'click #logout-button' : function(e, t){
    Meteor.call('unassignPushToken', function(err, res) {
      if (err) {
        console.log(err);
      } else {
        Meteor.logout();
        Router.go('login');
      }
    });
  }
});
