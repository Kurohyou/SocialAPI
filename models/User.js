const { Schema, model } = require('mongoose');
const Thought = require('./Thought.js');

const userSchema = new Schema(
  {
    username:{
      type: String,
      required: true,
      unique:true,
      max_length: 50
    },
    email:{
      type: String,
      required: true,
      max_length: 50,
      unique:true,
      validate: {
        validator(value){
          // Valid email regex pulled from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript/1373724#1373724
          return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(value);
        }
      }
    },
    thoughts:[
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends:[
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON:{
      virtuals: true
    },
    id: false
  }
);

userSchema
  .virtual('friendCount')
  .get(function(){
    return this.friends.length;
  });

const User = model('User',userSchema);

module.exports = User;