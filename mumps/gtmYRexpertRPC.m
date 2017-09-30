;!----------------------------------------------------------------------------!
;!                                                                            !
;! Licence et conditions d'utilisation                                        !
;! Yexpert : (your) Systeme Expert sous Mumps GT.M et GNU/Linux               !
;! Copyright (C) 2001-2015 by Hamid LOUAKED (HL).                             !
;!                                                                            !
;! Hamid LOUAKED                                                              !
;! 10, impasse Faraday                                                        !
;! 78520 LIMAY                                                                !
;! France                                                                     !
;!                                                                            !
;! yexpert@yrelay.fr                                                          !
;! http://www.yrelay.fr/                                                      !
;!                                                                            !
;! Ce programme est un logiciel libre ; vous pouvez le redistribuer           !
;! et/ou le modifier conformement aux dispositions de la Licence Publique     !
;! Generale GNU, telle que publiee par la Free Software Foundation ;          !
;! version 3 de la licence, ou encore (a votre choix) toute version ulterieure.
;!                                                                            !
;! Ce programme est distribue dans l'espoir qu'il sera utile,                 !
;! mais SANS AUCUNE GARANTIE ; sans meme la garantie implicite de             !
;! COMMERCIALISATION ou D'ADAPTATION A UN OBJET PARTICULIER.                  !
;! Pour plus de details, voir la Licence Publique Generale GNU.               !
;!                                                                            !
;! Un exemplaire de la Licence Publique Generale GNU doit etre fourni avec    !
;! ce programme ; si ce n'est pas le cas,                                     !
;! ecrivez a la Free Software Foundation Inc.,                                !
;! 675 Mass Ave, Cambridge, MA 02139, Etats-Unis.                             !
;!                                                                            !
;! Ce logiciel est telechargeable a l'adresse http://www.yrelay.fr/ ;         !
;! vous trouverez egalement, sur ce site, un mode d'emploi complet            !
;! et des informations supplementaires.                                       !
;!                                                                            !
;!----------------------------------------------------------------------------!
;!                                                                            !
;! GNU General Public License : http://www.gnu.org/copyleft/gpl.html          !
;!                                                                            !
;! Traduction francaise : http://dachary.org/loic/gpl-french.pdf              !
;!                                                                            !
;!----------------------------------------------------------------------------!

;!============================================================================!
;! Nomprog     : gtmYRexpertRPC                                                !
;! Module      : RPC (remote procedure call)                                  !
;! But         : Fonction permettant l'accès aux RPCs de Yexpert...           !
;!                                                                            !
;! Description :                                                              !
;!                                                                            !
;!                                                                            !
;!                                                                            !
;!                                                                            !
;!                                                                            !
;!----------------------------------------------------------------------------!
;! Modif ! Auteur ! Date     ! Commentaires                                   !
;!-------!--------!----------!------------------------------------------------!
;!       ! HL     ! 22/03/01 ! Creation                                       !
;! HL001 ! HL     ! 00/00/00 ! Description succincte de la modification.      !
;! HL002 ! HL     ! 00/00/00 !                                                !
;!-------!--------!----------!------------------------------------------------!
;!============================================================================!

;view "LINK":"RECURSIVE" zl "gtmYRexpertRPC" zl "RPC" zl "RPCBAS" zl "RPCSYS" zl "RPCUSR" zl "RPCQCS" w $$test^gtmYRexpertRPC() w !!! zwr ^TMP

gtmYRexpertRPC ;
 QUIT
 ;
test()
 k ^TMP
 s ^TMP($j,"name")="RPCUSR ETABLIR CONNEXION"
 s ok=$$RPCEXECUTE("^TMP($j)")
 QUIT ok
 ;
test2()
 k ^TMP
 s ^TMP($j,"name")="RPCUSR VERIFIER CODE"
 s ^TMP($j,"input",1,"value")="irelay"
 s ok=$$RPCEXECUTE("^TMP($j)")
 QUIT ok
 ;
test3()
 k ^TMP
 s ^TMP($j,"name")="RPCBAS AFFICHER BONJOUR"
 s ^TMP($j,"input",1,"type")="LITERAL"
 s ^TMP($j,"input",1,"value")="Bonjour le monde !"
 s ok=$$RPCEXECUTE("^TMP($j)")
 QUIT ok
 ;
RPCEXECUTE(TMP,sessionId,sessionGlobal) ;
 ;n ix
 ;s ix=$increment(^irelay)
 ;m ^irelay(ix)=@TMP
 ;s ^irelaySession(ix,"id")=$g(sessionId)
 ;s ^irelaySession(ix,"global")=$g(sessionGlobal)
 ;
 ; Exécuter un RPC basé sur les paramètres fournis dans la globale de référence ^TMP
 ;
 ; Paramètre d'entrée
 ; ==================
 ;
 ; ^TMP est une globale de référence avec des nœuds. Par exemple ^TMP($J)
 ;
 ;   ,"name")      NAME ("PARTITION",.01)
 ;   ,"version")   VERSION ("PARTITION",.09)
 ;   ,"use") = "Locale"|"Distante"
 ;   ,"input",n,"type")   PARAMETER TYPE ("PARTITION.02",#02)
 ;   ,"input",n,"value")  Valeur du paramètre d'entrée
 ;
 ;      Par exemple :
 ;      ,"input",n,"type")="LITERAL"
 ;      ,"input",n,"value")="abc"
 ;
 ;      ,"input",n,"type")="REFERENCE"
 ;      ,"input",n,"value")="^ABC"
 ;
 ;      ,"input",n,"type")="LIST"
 ;      ,"input",n,"value",m1)="list1"
 ;      ,"input",n,"value",m2,k1)="list21"
 ;      ,"input",n,"value",m2,k2)="list22"
 ;         
 ;          où m1, m2, k1, k2 sont des nombres ou des chaînes
 ;     
 ; Valeur de sortie
 ; ================
 ; La sortie RPC est @TMP@("result")
 ;  Par exemple, ,"result","type")="SINGLE VALUE"
 ;                         "value")="Bonjour le monde !"
 ;                
 ; Return {"success": result, "message" : message }
 ;    result 1 - success
 ;           0 - error
 ;
 ;
 ; RPCUSR ETABLIR CONNEXION - XUS SIGNON SETUP - Établit l'environnement nécessaire pour l'authentification DHCP
 ; RPCSYS VERIFIER CODE - XUS AV CODE - Cette API vérifie si une paire de codes ACCESS / VERIFY est valide.Il renvoie un tableau de valeurs R (0) = DUZ si l'authentification était OK, zéro si non OK.R (1) = (0 = OK, 1,2 ... = Impossible de se connecter pour une raison quelconque) .R (2) = vérifier les besoins change.R (3) = Message.R (4) = 0R (5) = compte du nombre de lignes de texte, zéro si None.R (5 + n) = texte du message.
 ; RPCORD ENVOI - ORWDX SEND - RPC pour signer une liste d'ordres avec entrée comme suit: DFN = Patient ORNP = Fournisseur ORL = Emplacement ES = Code ES crypté ORWREC (n) = ORIFN; Action ^ Signature Sts ^ Libération Sts ^ Nature de l'ordre
 ; RPCBAS AFFICHER BONJOUR - Bac à sable
 ;
 ; XWB EGCHO STRING^ECHO1^XWBZ1^1^R
 ; 1^etiquette^routine^typeResultat^5^6^7^resultat
 ;
 D INIT^RPC ; reinitialise la globale ^RPC
 N rpc,pRpc,tArgs,tCnt,tI,tOut,trash,tResult,X
 ;
 S U=$G(U,"^")  ; Définir par défaut "^"
 S $ETRAP="d errorPointer^gtmYRexpertRPC"
 ;
 S pRpc("name")=$G(@TMP@("name"))
 I pRpc("name")="RPCUSR ETABLIR CONNEXION" d HOME^RPCUSR
 I pRpc("name")="RPCUSR VERIFIER CODE" d
 . n avcode
 . s avcode=$G(@TMP@("input",1,"value"))
 . s avcode=$$ENCRYP^RPCSYS(avcode)
 . s @TMP@("input",1,"value")=avcode
 ;
 I pRpc("name")["RPCORD ENVOI",'$D(^TMP($J,"input",5,"value")) S ^TMP($J,"input",5,"value")="" ;***********
 ;;;I pRpc("name")="RPCBAS AFFICHER BONJOUR" d AFF^RPCBAS("Bonjour !")
 Q:pRpc("name")="" $$error(-1,"Le nom RPC est manquant")
 ;
 S rpc("ien")=$O(^RPC("YXP","id",pRpc("name"),""))
 Q:'rpc("ien") $$error(-2,"RPC non défini ["_pRpc("name")_"]")
 ;
 S XWBAPVER=$G(@TMP@("version"))
 S pRpc("use")=$G(@TMP@("use"))
 S pRpc("context")=$G(@TMP@("context"))
 S pRpc("division")=$G(@TMP@("division"))
 ;
 S:'$D(DUZ(2)) DUZ(2)=pRpc("division")
 ;
 S X=$G(^RPC("YXP",rpc("ien"),0)) ;Exemple : XWB EGCHO STRING^ECHO1^XWBZ1^1^R
 S rpc("routineTag")=$P(X,"^",2)
 S rpc("routineName")=$P(X,"^",3)
 Q:rpc("routineName") $$error(-4,"Nom de routine non défini pour RPC ["_pRpc("name")_"]")
 ;
 ; 1=SINGLE VALUE; 2=ARRAY; 3=WORD PROCESSING; 4=GLOBAL ARRAY; 5=GLOBAL INSTANCE
 S rpc("typeResultat")=$P(X,"^",4)
 S rpc("result")=$P(X,"^",8)
 ;
 ; Le RPC est-il disponible ?
 D CKRPC^RPC(.tOut,pRpc("name"),pRpc("use"),XWBAPVER)
 Q:'tOut $$error(-3,"RPC ["_pRpc("name")_"] Ne peut pas être exécuté pour le moment.")
 ;
 S X=$$CHKPRMIT(pRpc("name"),$G(DUZ),pRpc("context"))
 Q:X'="" $$error(-4,"RPC ["_pRpc("name")_"] N'est pas autorisé à être exécuté : "_X)
 ;
 S X=$$buildArguments(.tArgs,rpc("ien"),TMP)  ; Construire une liste d'arguments RPC - tArgs
 Q:X<0 $$error($P(X,U),$P(X,U,2)) ; Liste d'arguments de construction d'erreur
 ;
 ; Maintenant, préparer les arguments pour l'appel final
 ; il sont en dehors de la $$buildArgumets afin que nous puissions créer les paramètres individuels
 S (tI,tCnt)=""
 F  S tI=$O(tArgs(tI)) Q:tI=""  F  S tCnt=$O(tArgs(tI,tCnt)) Q:tCnt=""  N @("tA"_tI) X tArgs(tI,tCnt)  ; Définir/fusionner des actions
 ;
 S X="D "_rpc("routineTag")_"^"_rpc("routineName")_"(.tResult"_$S(tArgs="":"",1:","_tArgs)_")"
 S DIC(0)=""
 ;s ^irelay(ix,"X")=X
 ;s ^irelay(ix,"tA1")=$g(tA1)
 ;;;W "-----tA1=",tA1,!
 ;;;W "-----tA2=",tA2,!
 ;;;W "-----=",X,! Q "OK"
 W "-----X=",X,!
 X X  ; Exécuter la routine
 ;s ^irelay(ix,"execute")=""
 M @TMP@("result","value")=tResult
 ;;;;;;S @TMP@("result","type")=$$EXTERNAL^DILFD(8994,.04,,rpc("typeResultat"))
 S @TMP@("result","type")=$S(rpc("typeResultat")=1:"SINGLE VALUE",rpc("typeResultat")=2:"ARRAY",rpc("typeResultat")=3:"WORD PROCESSING",rpc("typeResultat")=4:"GLOBAL ARRAY",rpc("typeResultat")=5:"GLOBAL INSTANCE",1:"")
 I @TMP@("result","type")="TABLEAU GLOBAL",$g(sessionId)'="" d
 . n sessRef
 . s sessRef="^"_sessionGlobal_"(""session"","_sessionId_",""TABLEAU_GLOBAL"","""_pRpc("name")_""")"
 . s X="K "_sessRef X X
 . s X="M "_sessRef_"="_tResult X X
 . k @TMP@("result","value")
 . k @tResult
 S trash=$$success()
 Q "OK"
 ;
 ;
isInputRequired(pIEN,pSeqIEN) ; Le paramètre RPC d'entrée est requis
 ; pIEN - RPC IEN dans le fichier #YRELAY
 ; pSeqIEN - Paramètre d'entrée IEN dans le fichier multiple #YRELAY.02
 ;
 Q $P(^RPC("YXP",pIEN,2,pSeqIEN,0),U,4)=1
 ;
buildArguments(out,pIEN,TMP) ;Générer une liste d'arguments RPC
 ;
 ; Valeurs de retour
 ; =================
 ; Succès 1
 ; Erreur   -n^message d'erreur
 ;
 ; Tableau avec arguments en sortie
 N count,tCnt,tError,tIEN,tI,tII,tIndexSeq,tParam,tRequired,X
 ;
 S tI=0
 S tII=""
 S tCnt=0
 ;
 K out
 S out=""
 S tError=0
 S tIndexSeq=$D(^RPC("YXP",pIEN,2,"PARAMSEQ"))  ; Est la référence croisée définie
 S tParam=$S(tIndexSeq:"^RPC(""YXP"",pIEN,2,""PARAMSEQ"")",1:"^RPC(""YXP"",pIEN,2)")
 ;
 S count=0
 F  S tII=$O(@TMP@("input",tII)) Q:('tII)!(tError)  D
 . S count=count+1
 . S tIEN=tII  ; Obtenir le IEN du paramètre d'entrée
 . I '$D(@TMP@("input",tII,"value")) S out=out_"," Q
 . I $D(@TMP@("input",tII,"value"))=1 D  Q
 . . S out=out_"tA"_tII_","   ; add the argument
 . . I $$UP^RPCSTR($G(@TMP@("input",tII,"type")))="REFERENCE" D
 . . . S tCnt=tCnt+1,out(tII,tCnt)="S tA"_tII_"=@@TMP@(""input"","_tII_",""value"")"  ; régler le
 . . . Q
 . . E  S tCnt=tCnt+1,out(tII,tCnt)="S tA"_tII_"=@TMP@(""input"","_tII_",""value"")"  ; définisser le comme une action pour plus tard
 . . Q
 . ; tableau/liste
 . S out=out_".tA"_tII_","
 . S tCnt=tCnt+1,out(tII,tCnt)="M tA"_tII_"=@TMP@(""input"","_tII_",""value"")"  ; fusionner
 . Q
 ;
 Q:tError tError
 S out=$E(out,1,$L(out)-1)
 Q 1
 ;
formatResult(code,message) ; Retourner le résultat formaté JSON
 S ^TMP($J,"RPCEXECUTE","result")=code_U_message
 I code=0 Q "ERROR "_message
 Q "OK"
 ;Q "{""success"": "_code_", ""message"": """_$S($TR(message," ","")="":"",1:message)_"""}"
 ;
error(code,message) ;
 Q $$formatResult(0,code_" "_message)
 ;
success(code,message) ;
 Q $$formatResult(1,$G(code)_" "_$G(message))
 ;
 ;Le RPC est-il autorisé à s'exécuter dans un contexte ?
CHKPRMIT(pRPCName,pUser,pcontext) ;Vérifie si la procédure à distance est autorisée à s'exécuter
 ;Entrée : pRPCName  - Procédure de vérification à distance
 ;         pUser     - Utilisateur
 ;         pcontext  - RPC contexte
 Q:$$KCHK^RPCUSR("PROGRAMMEUR",pUser) ""  ; L'utilisateur dispose de la clé programmateur
 N result,X
 N XQMES
 S U=$G(U,"^")
 S result="" ;Retourne XWBSEC="" si OK pour exécuter RPC
 ;
 ;Au début, quand aucun DUZ n'est pas défini et aucun contexte n'existe,
 ;configurer le contexte de connexion par défaut
 S:'$G(pUser) pUser=0,pcontext="RPCUSR SE CONNECTER"   ;Configurer le contexte par défaut
 ;
 ;Ces RPCs sont autorisés dans n'importe quel contexte, donc nous pouvons juste quitter
 S X="^RPCBAS AFFICHER BONJOUR^RPCBAS JE SUIS ICI^RPCBAS CREER CONTEXTE^RPCBAS LISTE^RPCBAS EST RPC DISPONIBLE^RPCBAS OBTENIR INFORMATIONS UTILISATEUR^RPCBAS OBTENIR TOKEN^RPCBAS SET VISITEUR^"
 S X=X_"RPCUSR LINK OBTENIR INFORMATIONS UTILISATEUR^RPCUSR LINK SE DECONNECTER^"  ; Les RPCs de YexpertLink qui sont toujours autorisés.
 I X[(U_pRPCName_U) Q result
 ;
 ;
 ;Si en contexte [RPCUSR SE CONNECTER], ne permettre que les rpcs RPCUSR et RPCBAS
 I $G(pcontext)="RPCUSR SE CONNECTER","^RPCUSR^RPCBAS^RPCBDD^"'[(U_$E(pRPCName,1,6)_U) Q "Le contexte de l'application n'a pas été créé !"
 ;RPCQCS permet à tous les utilisateurs d'accéder au contexte RPCUSR SE CONNECTER.
 ;Aussi pour tout contexte dans le menu XUCOMMANDER.
 ;
 I $G(pcontext)="" Q "Le contexte de l'application n'a pas été créé !"
 ;
 w "-----",pUser,!
 w "-----",pcontext,!
 w "-----",pRPCName,!
 S X=$$CHK^RPCQCS(pUser,pcontext,pRPCName)         ;Faire le check
 S:'X result=X
 Q result
 ;
errorPointer ;
 ; Enregistrer le dernier pointeur d'erreur dans la global ^TMP
 ; afin que les détails de l'erreur puissent être récupérés plus tard
 n dd,no,rec
 ;;;s rec=$g(^%ZTER(1,0))
 ;;;s dd=$p(rec,"^",3)
 ;;;s rec=$g(^%ZTER(1,dd,0))
 ;;;s no=$p(rec,"^",2)
 s ^TMP($j,"ERRORTRAP",0)=1
 ;;;s ^TMP($j,"ERRORTRAP",1)=dd
 s ^TMP($j,"ERRORTRAP",2)=1
 ;;;s ^TMP($j,"ERRORTRAP",3)=no
 QUIT
