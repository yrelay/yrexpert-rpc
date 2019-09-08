/*

!----------------------------------------------------------------------------!
!                                                                            !
! Yexpert : (your) Système Expert sous Mumps GT.M et GNU/Linux               !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/


function authenticate(messageObj, sessions) {
  var results = sessions.authenticate(messageObj.headers.authorization);
  console.log('**** results = ' + JSON.stringify(results));
  if (results.error) return results;
  if (!results.session) return {
    error: 'Unexpected error - token authenticated, but unable to get session',
    status: {
      code: 500,
      text: 'Internal Server Error'
    }
  };
  console.log('****** authenticated ok - session ' + results.session.id);
  return results.session;
}

module.exports = authenticate;
