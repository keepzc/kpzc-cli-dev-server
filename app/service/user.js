// app/io/controller/chat.js
'use strict';

module.exports = app => {
  class User extends app.Service {
    async say(){
      return 'hello 2023'
    }
  }
  return User;
};
