/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var thing = require('./thing.model');

exports.register = function(socket) {
  thing.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  thing.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('thing:save', doc);
  console.log("Thing was saved.");
  console.log(doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('thing:remove', doc);
}

function onPress(socket, doc, cb) {
  socket.emit('thing:press', doc);
}
