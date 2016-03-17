Template.layout.helpers({
  iphone: function() {
    if (Meteor.isCordova) {
      if (Session.get('devicePlatform') === 'iOS'
      || Session.get('devicePlatform') === 'ios') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
});
