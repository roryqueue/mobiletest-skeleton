Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});

Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render('login');
	} else {
		this.next();
	}
},
{
	except: ['login', 'usernamePrompt', 'ping']
});

Router.route('/ping', {where: 'server'})
  .get(function () {
    this.response.end('OK');
  });

Router.route('/login');

Router.route('/options');

Router.route('/username', {
	name: 'usernamePrompt'
});

Router.route('/contactList');

Router.route('/loading');
