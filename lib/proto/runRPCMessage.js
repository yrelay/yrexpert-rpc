/*

!----------------------------------------------------------------------------!
!                                                                            !
! Yexpert : (your) Système Expert sous Mumps GT.M et GNU/Linux               !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/


var allowed = require('./allowed');
var runRPC = require('./runRPC');

module.exports = function(messageObj, session) {
  var methods = ['POST', 'PUT'];
  var ok = allowed(messageObj.method, methods);
  if (ok.error) return ok;

  var params = {
    rpcName: messageObj.params['0'],
    rpcArgs: messageObj.body
  };
  if (messageObj.query) {
    if (messageObj.query.format) params.format = messageObj.query.format;
    if (messageObj.query.context) params.context = messageObj.query.context;
    if (messageObj.query.returnGlobalArray === 'true') params.returnGlobalArray = true;
  }
  return runRPC.call(this, params, session);
};

