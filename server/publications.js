Meteor.publish("myObjects", function() {
	if (this.userId) {
		return Objects.find({
			toIds: this.userId,
			flagged: {
				$ne: true
			}
		});
	} else {
		this.ready();
	}
});
