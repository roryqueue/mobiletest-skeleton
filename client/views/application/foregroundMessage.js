Template.foregroundMessage.helpers({
  foregroundMessagePresent: function() {
    return Session.get('foregroundMessage') !== '';
  },
  message: function() {
    return Session.get('foregroundMessage');
  }
});
