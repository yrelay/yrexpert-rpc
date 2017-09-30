/*

!----------------------------------------------------------------------------!
!                                                                            !
! YRexpert : (Your Yrelay) Système Expert sous Mumps GT.M et GNU/Linux       !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

module.exports = function() {

  // Charger les gestionnaires de messages formatés au standard qoper8-express :

  var handleExpressMessage = require('ewd-qoper8-express').workerMessage;

  // Charger les gestionnaires spécifiques à yrexpert RPC
  var yrexpertRPC = require('yrexpert-rpc');

  this.on('start', function(isFirst) {

    // Configurer les gestionnaires de messages standard yrexpert RPC (initiation, login et authentification)
    yrexpertRPC.httpHandlers.call(this);

    // Pour prendre toutes les autres demandes de yrexpert.*
    this.on('yrexpertMessage', function(messageObj, session, send, finished) {
      console.log('*** yrexpertMessage: ' + session.id);
      finished({error: 'Aucun gestionnaire défini pour les messages yrexpert de type ' + messageObj.expressType});
  });

    // Connecter le worker à Gtm et démarrer l'abstraction globalStore
    var connectGtmTo = require('yrexpert-gtm');
    var params = {
      namespace: 'YXP'
    };
    connectGtmTo(this, params);

  });

  this.on('message', function(messageObj, send, finished) {
    var expressMessage = handleExpressMessage.call(this, messageObj, send, finished);
  });

};




