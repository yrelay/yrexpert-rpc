![yrexpert_logo.png](./images/yrexpert_logo.png)

# Accès REST aux RPCs de YRexpert... 

[![npm version][npm-image]][npm-url]
[![npm downloads][downloads-image]][downloads-url]

Cette arborescence fournit le module d'accès REST aux RPCs de yrexpert et les outils que vous aurez besoin pour l'adapter à votre application. Elle est maintenue par Yrelay et diffusée sous licence libre. Cette version comprend des contributions communautaires libres acceptées par Yrelay.

Disclaimer : yrexpert est encore en développement et son interface peut changer dans les futures versions. Utilisez cette production à vos propres risques.

Ce dépot est fortement inspiré de l'application [EWD 3](http://www.mgateway.com/) de Rob Tweed (Merci).

## 1. yrexpert-rpc

Ce module utilise les framworks ewd-qoper8 et Express et fournit les outils pour accéder aux RPCs de yrexpert. yrexpert est le système expert de [https://www.yrelay.fr/](https://www.yrelay.fr/).

Pour plus de détails sur ewd-qoper8, voir :
  [http://gradvs1.mgateway.com/download/ewd-qoper8.pdf](http://gradvs1.mgateway.com/download/ewd-qoper8.pdf)

## 2. Installer yrexpert-rpc

       npm install yrexpert-rpc
	   
## 3. Utiliser yrexpert-rpc

Un exemple fonctionnel est fourni dans le répertoire /example.

Le processus principal est défini dans /example/yrexpertrpc

Le module de processus worker est dans /example/yrexpertrpc-worker-module

### 3.1. Préparer yrexpert-rpc

L'exemple est conçu pour être utilisé avec yrexpert s'exécutant sur une plate-forme de base de données GT.M.

Vous devrez installer les éléments suivants :

       npm install express
       npm install body-parser
       npm install ewd-qoper8
       npm install ewd-qoper8-express
       npm install ewd-qoper8-gtm
       npm install ewd-document-store
       npm install ewd-session
       npm install nodem
       npm install yrexpert-rpc

Le module worker (/example/yrexpertrpc-worker-module.js) suppose que la base de données yrexpert se trouve dans GT.M sous avec une partition nommé 'YXP' et
GT.M est accécible depuis un lien symbolique de la forme /home/instance/libraries/gtm.

Pour adapter le module à votre système, modifiez l'objet params à l'intérieur de ces lignes dans le module worker:

      var connectGtmTo = require('ewd-qoper8-gtm');
      var params = {
        namespace: 'YXP'
      };
      connectGtmTo(this, params);

Vous pouvez spécifier une ou toutes les propriétés de paramétrage suivantes :

- path: Chemin d'accès du répertoire MGR de votre système GT.M (/home/instance/partitions)
- username: Le nom d'utilisateur pour se connecter à GT.M (DMO)
- password: Ce mot de passe pour se connecter à Cache (DMO)
- namespace: La patition sur laquelle il faut se connecter (YXP)

Vous devez également vous assurer que vous installez deux routines GT.M dans la partition, où vous serez connecté:

- EwdSymbolTable.m que vous trouverez dans le répertoire du module ewd-session dans le chemin /mumps. Enregistrer et compiler la routine.
- gtmYRexpertRPC.m que vous trouverez dans le répertoire du module yrexpert-rpc dans le chemin /mumps. Enregistrer et compiler la routine.

Enregistrer et compiler les routines par programme comme suit:

      mumps /home/instance/yrexpert-js/node_modules/ewd-session/mumps/ewdSymbolTable.m
      mumps /home/instance/yrexpert-js/node_modules/yrexpert-rpc/mumps/gtmyrexpertRPC.m

Note : Modifier les chemins de fichier de manière appropriée pour votre configuration

Par défaut, le processus principal (/example/yrexpertrpc.js) démarrera Express et lui dira d'écouter sur le port 8082.
Si vous souhaitez utiliser un autre port, modifiez cette ligne dans le fichier du processus principal :

        app.listen(8082);

Par défaut, ewd-qoper8 utilisera une taille de pool de travail de 1. Si vous voulez plus de process ewd-qoper8 disponibles, ajoutez simplement les lignes suivantes après la ligne app.listen :

        q.on('start', function() {
          this.setWorkerPoolSize(3);
        });

### 3.2. Démarrer Express et ewd-qoper8

Assurez-vous que vous êtes dans le répertoire où vous étiez lorsque vous avez installé tous les modules Node.js

        node node_modules/yrexpert-rpc/example/yrexpertrpc

Vous devrez peut-être faire cela en tant que sudo, en fonction des paramètres d'autorisation pour Express et GT.M.

Vous devriez voir ce qui suit:

      Worker Bootstrap Module file written to node_modules/ewd-qoper8-worker.js
      ========================================================
      ewd-qoper8 is up and running.  Max worker pool size: 1
      ========================================================
      yrexpertrpc est en cours d'exécution et d'écoute sur le port 8082

Express est maintenant en cours d'exécution et il écoute sur le port 8082 (ou le port que vous avez changé).

### 3.3. Utiliser yrexpert-rpc

Utiliser un client REST (par exemple, le client Chrome Advanced REST ou l'extention FireFox RESTclient)

La première chose que vous devez faire est de vous connecter à yrexpert. Vous devez connaître un code d'accès et de vérification d'yrexpert valide :

       POST http://XXX.XXX.XXX.XXX:8082/yrexpert/login

Identifie le protocole utilisé pour le transfert, le paquet de données est représenté par un document JSON contenant les codes d'accès et de vérification, par exemple :

      {
        "accessCode": "mYAccessC0de!",
        "verifyCode": "mYver1fYC0de#"
      }

Important : Assurez-vous de définir sur votre client REST le **Content-Type** sur **application/json**

Si les informations d'identification ne sont pas correctes, vous recevrez une réponse d'erreur HTTP. Sinon, vous devriez voir un objet de Bienvenue/Login yrexpert, avec un jeton de session par exemple:

      {
        "token": "7084375e-2e4f-45ea-891c-25b1d69ba1d0",
        "displayName": "Irelay",
        "greeting": "Bienvenue chez Irelay",
        "lastSignon": "Votre derniere connection est aujourd'hui a 12:39",
        "messages": [
        "Votre derniere connection est aujourd'hui a 12:39",
        "Vous avez 311 nouveaux messages. (311 dans le panier 'IN')",
        "",
        "Entrez '^NML' pour lire vos nouveaux messages.",
        "Vous avez un courrier PRIORITAIRE!"
        ]
      }

Important : Copier et coller la valeur de la propriété token (sans les guillemets) dans le champ **En-tête d'autorisation** du client REST.

Vous pouvez maintenant exécuter n'importe quel RPC dont les droits d'accès de l'utilisateur connecté dispose :

       POST http://XXX.XXX.XXX.XXX:8082/yrexpert/runRPC/[RPC Name]

Exemple 1 :

       POST http://localhost:8082/yrexpert/runRPC/RPCBAS AFFICHER BONJOUR

Remarque : il se peut que vous deviez remplacer les espaces du nom RPC avec %20

Le paquet de données doit être un objet JSON qui définit les arguments RPC, par exemple:

      [
        {
          "type": "LITERAL",
          "value": "Bonjour le monde !"
        }
      ]

Pour l'exemple ci-dessus, si vous réussissez, vous devriez voir une réponse comme :

      {
        "type": "SINGLE VALUE",
        "value": "Bonjour le monde !"
      }

Exemple 2 :

       POST http://localhost:8082/yrexpert/runRPC/RPCBDD EXECUTER COMMANDE SET

Remarque : il se peut que vous deviez remplacer les espaces du nom RPC avec %20

Le paquet de données doit être un objet JSON qui définit les arguments RPC, par exemple:

      [
        {"type": "LITERAL", "value": "DMO"},
        {"type": "LITERAL", "value": "BAC.A.SABLE"},
        {"type": "LITERAL", "value": "DEFAUT"},
        {"type": "LITERAL", "value": "DESCRIPTION"},
        {"type": "LITERAL", "value": "Bonjour le monde !"},
        {"type": "LITERAL", "value": "1"}
      ]

Pour l'exemple ci-dessus, si vous réussissez, vous devriez voir une réponse comme :

      {
        "type": "SINGLE VALUE",
        "value": "Description modifiée par RPC !"
      }

Assurez-vous que toutes les requêtes ont l'en-tête Autorisation défini sur le jeton retourné par la requête initiale, et que leur Content-Type est application/json. Si vous rencontrez des problèmes, vous pouvez directement ajouter dans l'entête du client REST **Authorization** égale à **7084375e-2e4f-45ea-891c-25b1d69ba1d0**

## 4. Comment contribuer ?

* Dupliquer le dépôt (utiliser Fork)
* Créer un nouvelle branche (git checkout -b ma-branche)
* Commit(er) votre proposition d'évolution (git commit -am 'Ajouter mon évolution')
* Push(er) la branche (git push origin ma-branche)
* Créer une demande d'évolution (utiliser Pull Requests)

Pour remonter un bug : [https://github.com/yrelay/yrexpert-term/issues](https://github.com/yrelay/yrexpert-term/issues)

## 5. Liens

* Yrelay Page d'accueil : [https://www.yrelay.fr/](https://www.yrelay.fr/)
* Yrelay Référentiels : [https://code.yrelay.fr/](https://code.yrelay.fr/)
* Yrelay Github : [https://github.com/Yrelay/](https://github.com/Yrelay/)

[npm-image]: https://img.shields.io/npm/v/yrexpert-rpc.svg
[npm-url]: https://npmjs.org/package/yrexpert-rpc
[downloads-image]: https://img.shields.io/npm/dm/yrexpert-rpc.svg
[downloads-url]: https://npmjs.org/package/yrexpert-rpc


