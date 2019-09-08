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

  var ref = session.data.$('ERRORTRAP');
  if (ref.exists) {
    var subs = ref.getDocument(true);
    var zter = new this.documentStore.DocumentNode('%ZTER', subs);
    return zter.getDocument(true);
  }
  else {
    return {
      error: 'No Error data available',
      status: {
        code: 404,
        text: 'Not Found'
      }
    };
  }
};

