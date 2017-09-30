/*

!----------------------------------------------------------------------------!
!                                                                            !
! YRexpert : (Your Yrelay) Système Expert sous Mumps GT.M et GNU/Linux       !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/


var runRPC = require('yrexpert-rpc/lib/proto/runRPC');
var httpHandlers = require('yrexpert-rpc/lib/proto/httpHandlers');

module.exports = {
  run: runRPC,
  httpHandlers: httpHandlers
};
