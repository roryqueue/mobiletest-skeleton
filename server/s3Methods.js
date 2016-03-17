// Set AWS keys on startup
Meteor.startup(function(){
	AWS.config.update({
		accessKeyId: "AKIAJBL7FKCJ74JUUKXQ",
		secretAccessKey: "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"
	});
});

Meteor.methods({

	uploadToS3: function(image){

		s3 = new AWS.S3();

		// Meteor camera gives a base64 encoded string for the image
		// Decode it and create a unique key to store it under
		imageBuffer = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""),'base64')
		urlExtension = +new Date + Meteor.userId() + ".png";

		s3.putObject({
			Bucket: "XXXXXXXXXX",
			Key: urlExtension,
			Body: imageBuffer,
			ContentEncoding: 'base64',
			ContentType: 'image/jpeg'
		}, function(err, data){
			if (!err){
				console.log(data);
			} else{
				console.log(err);
			}
		});
		console.log(urlExtension)

		// Returns the key that the file was stored under to the client
		return urlExtension;
	}

});
