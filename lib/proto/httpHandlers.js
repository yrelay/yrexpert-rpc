/*

!----------------------------------------------------------------------------!
!                                                                            !
! Yexpert : (your) Système Expert sous Mumps GT.M et GNU/Linux               !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

var runRPCMessage = require('./runRPCMessage');
var authenticate = require('./authenticate');
var getGlobalArray = require('./getGlobalArray');
var getErrorReport = require('./getErrorReport');
var login = require('./login');
var sessions = require('ewd-session');

function httpHandlers() { 

  this.on('DocumentStoreStarted', function() {

    console.log('clearing down ^TMP for ' + process.pid);
    var tmpGlo = new this.documentStore.DocumentNode('TMP');
    tmpGlo.$(process.pid).delete();
    var params = {
      range: {
        from: 'A'
      }
    };
    tmpGlo.forEachChild(params, function(ix, subNode) {
      console.log('clearing down ' + ix + ' nodes');
      subNode.$(process.pid).delete();
    });


    this.db.symbolTable = sessions.symbolTable(this.db);
    sessions.garbageCollector(this);
    sessions.init(this.documentStore);
  });

  // Intercepter l'événement raw message express
  this.on('expressMessage', function(messageObj, send, finished) {
 
    if (messageObj.application !== 'yexpert') {
      this.emit('unknownExpressMessage', messageObj, send, finished);
      return;
    }

    // Manipulation spéciale uniquement pour les messages yexpert
    if (messageObj.expressType === 'login') {
      var results = login.call(this, messageObj, sessions);
      finished(results);
      return;
    }

    // Tous les autres messages doivent d'abord être authentifiés ...
    var session = authenticate(messageObj, sessions);
    console.log('**** session = ' + JSON.stringify(session));
    if (session.error) {
      finished(session);
      return;
    }

    if (messageObj.expressType === 'runRPC') {
      var results = runRPCMessage.call(this, messageObj, session);
      finished(results);
      return;
    }

    if (messageObj.expressType === 'GLOBAL_ARRAY') {
      var results = getGlobalArray.call(this, messageObj, session);
      finished(results);
      return;
    }

    if (messageObj.expressType === 'errorReport') {
      var results = getErrorReport.call(this, messageObj, session);
      finished(results);
      return;
    }

    var ok = this.emit('YexpertMessage', messageObj, session, send, finished);
    if (!ok) {
      var results = {
        error: 'No handler found for ' + messageObj.path + ' message'
      };
      finished(results);
    }
  });
}

module.exports = httpHandlers;
