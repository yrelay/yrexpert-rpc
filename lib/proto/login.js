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

function login(messageObj, sessions) {

  var methods = ['POST'];
  var ok = allowed(messageObj.method, methods);
  if (ok.error) return ok;

  var accessCode = messageObj.body.accessCode;
  if (!accessCode || accessCode === '') return {
    error: 'Missing access code',
    status: {
      code: 403,
      text: 'Forbidden'
    }
  };

  var verifyCode = messageObj.body.verifyCode;
  if (!verifyCode || verifyCode === '') return {
    error: 'Missing verify code',
    status: {
      code: 403,
      text: 'Forbidden'
    }
  };

  var params = {
    rpcName: 'RPCUSR ETABLIR CONNEXION'
  };

  // Don't save the symbol table yet!
  var response = runRPC.call(this, params, session, false);
  console.log('RPCUSR ETABLIR CONNEXION response: ' + JSON.stringify(response));
  
  params = {
    rpcName: 'RPCUSR VERIFIER CODE',
    rpcArgs: [{
      type: 'LITERAL',
      value: accessCode + ';' + verifyCode
    }],
  };

  var response = runRPC.call(this, params, session, false);
  console.log('RPCUSR VERIFIER CODE response: ' + JSON.stringify(response));
  var values = response.value;
  var duz = values[0];
  var err = values[3]
  if (duz.toString() === '0' && err !== '') {
    return {
      error: err,
      status: {
        code: 403,
        text: 'Forbidden'
      }
    };
  }
  else {

    // Connecté avec succès
    // Créer une session et enregistrer une table de symboles ...
    var session = sessions.create('yexpert', 1200); // 20 minutes timeout

    ok = this.db.symbolTable.save(session);
    // Nettoyer le processus de back-end Cache/GT.M:
    ok = this.db.symbolTable.clear();

    session.authenticated = true;

    if (this.yexpertRPC && this.yexpertRPC.context) {
      session.data.$('Yexpert').$('context').value = this.yexpertRPC.context;
    }

    // Réponse de retour
    var greeting = values[7];
    var pieces = greeting.split(' ');
    pieces = pieces.splice(2, pieces.length);
    var displayName = pieces.join(' ');

    var results = {
      token: session.token,
      displayName: displayName,
      greeting: greeting,
      lastSignon: values[8],
      messages: values.splice(8, values.length)
    };
    if (this.userDefined && this.userDefined.returnDUZ) results.duz = duz;
    return results;
  }
}

module.exports = login;
