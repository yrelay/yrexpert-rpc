/*

!----------------------------------------------------------------------------!
!                                                                            !
! Yexpert : (your) Système Expert sous Mumps GT.M et GNU/Linux               !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/


function allowed(method, list) {
  if (!list) return {ok: true};            // Toute méthode permise
  method = method || ['undefined method']; // Valeur factice impossible à forcer l'erreur

  var found = false;
  for (var i = 0; i < list.length; i++) {
    if (list[i] === method) {
      found = true;
      break;
    }
  }
  if (!found) {
    return {
      error: method + ' not allowed',
      status: {
        code: 405,
        text: 'Method Not Allowed'
      }
    };
  }
  return {ok: true};
}

module.exports = allowed;
