/*

!----------------------------------------------------------------------------!
!                                                                            !
! yrexpert : (your) Système Expert sous Mumps GT.M et GNU/Linux               !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/


function runRPC(params, session, manageSymbolTable) {
  var rpcName = params.rpcName;

  if (typeof manageSymbolTable === 'undefined') manageSymbolTable = true;

  console.log('yrexpertrpc.runRPC: ' + JSON.stringify(params));
  console.log('manageSymbolTable: ' + manageSymbolTable);

  var data;

  // Le contexte et la division par défaut ne peuvent être surchargés que via les valeurs de Session sous la propriété 'yrexpert'
  if (session) var context = session.data.$('yrexpert').$('context').value;
  if (!context || context === '') {
    if (rpcName == "RPCBDD LISTER" || rpcName == "RPCBDD OBTENIR DONNEES ENTREE") {
      context = "INTERFACE GRAPHIQUE CARACTERE";
    } 
    else {
      context = "INTERFACE GRAPHIQUE CHAMP";
    }
  }
  if (params.context) context = params.context;
  if (session) var division = session.data.$('yrexpert').$('division').value;
  if (!division || division === '') division = 500;
     // DOIT REGLER CETTE ÉGALITE À LA STATION ID !!! L'ÉCRITURE DES COMMANDES ÉCHOURA SANS CELA

  var tmpGlo = new this.documentStore.DocumentNode('TMP');
  tmpGlo.$('XQCS').$(process.pid).delete();
	
  var gloRef = tmpGlo.$(process.pid);
  // **** Essentiel - doit effacer la première globale temporaire :
  gloRef.delete();

  var flags = {};
  var rpcArgs = params.rpcArgs || [];

  if (!Array.isArray(rpcArgs)) {
    flags = rpcArgs.flags || {};
    rpcArgs = rpcArgs.inputs || [];
  }


  if (rpcName === 'RPCUSR ETABLIR CONNEXION') {
    data = {
      name : rpcName
    };
    ok = this.db.symbolTable.clear();
  }
  else {
    data = {
      name : rpcName,
      division: division,
      context: context,
      input: rpcArgs || []
    };
    if (manageSymbolTable) ok = this.db.symbolTable.restore(session);
  }
  gloRef.setDocument(data, true, 1);
  //console.log('***** data = ' + JSON.stringify(data));

  var id = '';
  var documentName = '';
  if (session && session.id) {
    id = session.id;
    documentName = session.documentName;
  }

  var status = this.db.function({
    function: "RPCEXECUTE^gtmYRexpertRPC", 
    arguments: ['^TMP(' + process.pid + ')', id, documentName]
  });
  if (manageSymbolTable) {
    // Enregistrer la table des symboles yrexpert
    ok = this.db.symbolTable.save(session);
    // Nettoyer le processus de back-end Cache/GT.M:
    ok = this.db.symbolTable.clear();
  }

  console.log('***** status = ' + JSON.stringify(status));
  if (!status) return {
    error: "La fonction de préparation de l'environnement Mumps gtmYRexpertRPC s est plantée"
  };

  if (status.ErrorMessage) {
    return {
      error: status.ErrorMessage
    };
  }
  if (status.result === 'ERROR') {
    var execResult = gloRef.$('RPCEXECUTE').$('result').value;
    var pieces = execResult.split('^');
    return {
      error: pieces[1]
    };
  }
  if (gloRef.$('ERRORTRAP').exists) {
    var subs = gloRef.$('ERRORTRAP').getDocument();
    if (session) {
      session.data.$('ERRORTRAP').delete();
      session.data.$('ERRORTRAP').setDocument(subs);
    }
    return {
      error: "Une erreur d exécution s'est produite et a été piégée. Utilisez la commande errorReport RPC pour plus de détails"
    };
  }
  else {
    var resultsNode = gloRef.$('result');
    var results = resultsNode.getDocument(true);

    if (!params.hasOwnProperty("deleteGlobal") || params.deleteGlobal) { // Si nous n'avons pas mis le drapeau ou si c'est vrai
      gloRef.delete();
    }

    if (this.yrexpertRPC && this.yrexpertRPC.cleardown && this.yrexpertRPC.cleardown[rpcName]) {
      var subList = this.yrexpertRPC.cleardown[rpcName];
      for (var i = 0; i < subList.length; i++) {
        tmpGlo.$(subList[i]).$(process.pid).delete();
      }
    }

    if (results.type !== 'GLOBAL ARRAY' && params.format === 'raw') {
      return results;
    }
    else {
      if (results.type === 'SINGLE VALUE') {
        if (results.value && results.value.indexOf('^') !== -1) {
          var arr = results.value.split('^');
          results.value = arr;
        }
      }
      if (results.type === 'GLOBAL ARRAY') {
        if (flags.returnGlobalArray || params.returnGlobalArray) {
          results = {
            type: 'GLOBAL ARRAY',
            value: session.data.$('GLOBAL_ARRAY').$(rpcName).getDocument(true, 1)
          };
        }
      }

      return results;
    }

  }
}

module.exports = runRPC;

