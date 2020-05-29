var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com',{
  protocolId: 'MQIsdp',
  protocolVersion: 3
});

client.subscribe('testjancok');
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
