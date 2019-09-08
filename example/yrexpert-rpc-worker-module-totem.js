/*

!----------------------------------------------------------------------------!
!                                                                            !
! YRexpert : (Your Yrelay) Système Expert sous Mumps GT.M et GNU/Linux       !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

module.exports = function() {

  // Charge qoper8-express le gestionnaires standard de messages formatés :

  var handleExpressMessage = require('ewd-qoper8-express').workerMessage;

  // load yrexpert RPC-specific handlers

  var yrexpertRPC = require('yrexpertrpc');

  this.on('start', function(isFirst) {

    // Configurer des gestionnaires de messages yrexpert RPC standard (initiation, login et authentification)
    yrexpertRPC.httpHandlers.call(this);
    this.yrexpertRPC = {
      context: 'HMP UI CONTEXT',
      cleardown: {
        'HMP WRITEBACK ALLERGY': ["ALLERGY", "GMRA", "HMPF"]
      }
    };

    // Pour prendre toutes les autres demandes de yrexpert.*

    this.on('yrexpertMessage', function(messageObj, session, send, finished) {
      console.log('*** yrexpertMessage: ' + session.id);
      finished({error: 'Aucun gestionnaire défini pour les messages yrexpert de type ' + messageObj.expressType});
    });

    // Connecter le worker à Gtm et démarrer l'abstraction globalStore

    var connectGtmTo = require('yrexpert-gtm');
    var params = {
      //path: 'libraries/gtm',
      namespace: 'YXP'
    };
    connectGtmTo(this, params);

  });

  this.on('message', function(messageObj, send, finished) {
    var expressMessage = handleExpressMessage.call(this, messageObj, send, finished);
  });

};
