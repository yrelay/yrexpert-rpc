/*

!----------------------------------------------------------------------------!
!                                                                            !
! Yexpert : (your) Système Expert sous Mumps GT.M et GNU/Linux               !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/


var allowed = require('./allowed');

module.exports = function(messageObj, session) {
  
  var methods = ['GET'];
  var ok = allowed(messageObj.method, methods);
  if (ok.error) return ok;

  var rpcName = messageObj.query.rpcName;
  if (!rpcName || rpcName === '') return {
    error: 'Missing rpcName',
    status: {
      code: 403,
      text: 'Forbidden'
    }
  };
  var ref = session.data.$('GLOBAL_ARRAY').$(rpcName)
  if (ref.exists) {
    return ref.getDocument(); 
  }
  else {
    return {
      error: 'No GLOBAL_ARRAY data available for ' + rpcName,
      status: {
        code: 404,
        text: 'Not Found'
      }
    };
  }
};

