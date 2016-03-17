Push.addListener();

Push.addListener('alert', function(notification) {
  console.log(notification);
});
