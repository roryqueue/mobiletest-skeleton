Meteor.startup(function(){
	Session.setDefault('foregroundMessage', '');
	Session.setDefault('devicePlatform', '');
	deviceContacts = navigator.contacts;
	Session.set('devicePlatform', device.platform)
	deviceEmail = window.plugin.email;
	document.addEventListener("deviceready", onDeviceReady, false);

	function onDeviceReady() {
		//gets rid of weird backbutton behavior on android
		//currently backbutton always closes app a la ios
		document.addEventListener("backbutton", function(e){
			e.preventDefault();
			navigator.app.exitApp();
		}, false);
	}
});
