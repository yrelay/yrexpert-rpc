/*

!----------------------------------------------------------------------------!
!                                                                            !
! YRexpert : (Your Yrelay) Système Expert sous Mumps GT.M et GNU/Linux       !
! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
!                                                                            !
!----------------------------------------------------------------------------!

*/

var express = require('express');
var bodyParser = require('body-parser');
var qoper8 = require('ewd-qoper8');
var qx = require('ewd-qoper8-express');

var app = express();
app.use(bodyParser.json());
app.use(function(err, req, res, next) {
  if (err) {
    res.status(400).send({error: err});
    return;
  }
  next();
});

var q = new qoper8.masterProcess();
qx.addTo(q);

app.use('/yrexpert', qx.router());

q.on('started', function() {

  // Les processus du worker chargeront le module yrexpert1.js :

  this.worker.module = 'yrexpert-rpc/example/yrexpert-rpc-worker-module';
  //this.worker.module = 'yrexpertrpc-worker-module';
  var port = 8082;
  app.listen(port);

  console.log("yrexpertrpc est en cours d'exécution et d'écoute sur le port " + port);
});

q.start();



