loadingMessage = function(message, reactiveSpot, speed) {
  if (typeof(speed)==='undefined') { speed = 1 };
  characterInterval = 300 * speed;
  messageInterval = 1000 * speed;
  if (message.length < 1) {
    setTimeout(function(){
      reactiveSpot.set('');
      return true;
    }, messageInterval);
  } else {
    reactiveSpot.set(reactiveSpot.get().concat(message[0]));
    setTimeout(function(){
      loadingMessage(message.substr(1), reactiveSpot, speed);
    }, characterInterval);
  }
};

multipleLoadingMessages = function(messages, reactiveSpot, speed) {
  if (typeof(speed)==='undefined') { speed = 1 };
  characterInterval = 300 * speed;
  messageInterval = 1000 * speed;
  if (messages.length < 1) {
    return true;
  } else {
    currentMessage = messages.shift()
    loadingMessage(currentMessage, reactiveSpot, speed);
    setTimeout(function(){
      multipleLoadingMessages(messages, reactiveSpot, speed);
    }, characterInterval * currentMessage.length + messageInterval * 1.5);
  }
};

foregroundLoadingMessage = function(message, speed) {
  if (typeof(speed)==='undefined') { speed = 1 };
  characterInterval = 300 * speed;
  messageInterval = 1000 * speed;
  if (message.length < 1) {
    setTimeout(function(){
      Session.set('foregroundMessage','');
      return true;
    }, messageInterval);
  } else {
    Session.set(
      'foregroundMessage',
      Session.get('foregroundMessage').concat(message[0])
    );
    setTimeout(function(){
      foregroundLoadingMessage(message.substr(1), speed);
    }, characterInterval);
  }
};

multipleForegroundLoadingMessages = function(messages, speed) {
  if (typeof(speed)==='undefined') { speed = 1 };
  characterInterval = 300 * speed;
  messageInterval = 1000 * speed;
  if (messages.length < 1) {
    return true;
  } else {
    currentMessage = messages.shift()
    foregroundLoadingMessage(currentMessage, speed);
    setTimeout(function(){
      multipleForegroundLoadingMessages(messages, speed);
    }, characterInterval * currentMessage.length + messageInterval * 1.5);
  }
};
