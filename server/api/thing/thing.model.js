/*
 * Filename: thing.model.js
 * Description: Model for testing data
 */ 

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  bankAcc: {
            saving: Number,
            checking: Number
          },
  transactions :  [
                    { date : String, description : String, debit : Number,
                      credit : Number , balance : Number}
                  ]
});

module.exports = mongoose.model('Thing', ThingSchema);
