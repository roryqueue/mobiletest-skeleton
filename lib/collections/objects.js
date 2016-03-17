Objects = new Mongo.Collection("objects");

// Explicitly allow all client side inserts and updates,
Objects.allow({
	insert: function (userId, doc) {
		true
	},
	update: function(userId, doc, fieldNames, modifier){
		true
	}
});
