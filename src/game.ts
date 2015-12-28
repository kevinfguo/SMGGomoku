// 'use strict';
//
// angular.module('myApp', ['ngTouch'])
//   .controller('Ctrl', function (
//        $window, $scope, $log, $timeout,
//       aiService, gameService, scaleBodyService, gameLogic) {

module game{

  'use strict';
  var board : any;
  var delta : any;
  var numOfMoves : any;
  var isAiWorking : any;
  var isYourTurn : any;
  var turnIndex: any;
  var newMove : any;
  var isFinished : any;
  export let isHelpModalShown: boolean = false;


  var moveAudio = new Audio('audio/move.wav');
  moveAudio.load();

  // iniAiService();

  export function init() {
    console.log("Translation of 'RULES_OF_GOMOKU' is " + translate('RULES_OF_GOMOKU'));
    resizeGameAreaService.setWidthToHeight(1);
    gameService.setGame({
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
    iniAiService();
  }

  export function updateUI(params : any) {
    console.log("Game got updateUI:", params);
    board = params.stateAfterMove.board;
    delta = params.stateAfterMove.delta;
    if (board === undefined) {
    	numOfMoves = 0;
    	isAiWorking = false;
      board = [['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
	           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];
    } else {
      // Only play a sound if there was a move (i.e., state is not empty).
      moveAudio.play();
    }
  	isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
    params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
    turnIndex = params.turnIndexAfterMove;
    if (isYourTurn && params.playersInfo[params.yourPlayerIndex].playerId === '') {
    // Wait 500 milliseconds until animation ends.
    	$timeout(sendComputerMove, 600);
  	}
  }

    export function sendComputerMove() {
        var aimove : any = [];
        if(numOfMoves < 2){
        	aimove = firstAIMoveGenerator();
        }
        else{
        	aimove = aiServiceMakeMove();
        }
        newMove = aimove;
        gameService.makeMove(gameLogic.createMove(board, aimove[0], aimove[1], turnIndex));
        //isFinished = updateMessage(gameLogic.createMove(board, aimove[0], aimove[1], turnIndex));
        aiService.informingComputer(aimove[0], aimove[1], 'white');
        $timeout(updateAIStatues, 500);
        numOfMoves++;
    }

    export function updateAIStatues(){
        isAiWorking = false;
        // if (!isFinished){
        // 	document.getElementById("gamemsg").innerHTML = "Black's turn";
        // }
    }

    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

    export function iniAiService(){
    	aiService.iniComputer('easy');
    }

    export function aiServiceMakeMove(){
    	return aiService.getMove();
    }

    export function firstAIMoveGenerator(){
    	var moves=[
            [6,6],
            [6,7],
            [6,8],
            [7,6],
            [7,7],
            [7,8],
            [8,6],
            [8,7],
            [8,8]
        ];
        while(true){
            var ind=Math.floor(Math.random()*moves.length);
            if(board[moves[ind][0]][moves[ind][1]] === ''){
                return [(moves[ind][0]),(moves[ind][1])];
            }else{
                moves.splice(ind,1);
            }
        }
    }
    /*
    function sendMakeMove(move) {
      $log.info(["Making move:", move]);
      if (isLocalTesting) {
        stateService.makeMove(move);
      } else {
        messageService.sendMessage({makeMove: move});
      }
      if('endMatch' in move[0]){
				var score = move[0].endMatch.endMatchScores;
				if(score[0] > score[1]){
					$window.document.getElementById("gamemsg").innerHTML = "Game over, Black Wins";
				}
				else if(score[0] < score[1]){
					$window.document.getElementById("gamemsg").innerHTML = "Game over, White Wins";
				}
				else{
					$window.document.getElementById("gamemsg").innerHTML = "Game over, Ties";
				}
				setTimeout(function(){$window.document.getElementById("alertbox").style.display = "block";}, 1000);
			}
    }
    */
    // export function updateMessage(move : any){
    //   if('endMatch' in move[0]){
  	// 			var score = move[0].endMatch.endMatchScores;
  	// 			if(score[0] > score[1]){
  	// 				document.getElementById("gamemsg").innerHTML = "Black Wins";
  	// 			}
  	// 			else if(score[0] < score[1]){
  	// 				document.getElementById("gamemsg").innerHTML = "White Wins";
  	// 			}
  	// 			else{
  	// 				document.getElementById("gamemsg").innerHTML = "Ties";
  	// 			}
  	// 			document.getElementById("newgamebt").style.display = "block";
  	// 			return true;
  	// 	}
  	// 	return false;
    // }

    export function placeDot (str : any, row : any, col : any){

      var piece = board[row][col];
      if(piece ===''){
      	return 'img/empty.png';
      	//return 0;
      }
      if(piece === 'X'){
      	if(row === newMove[0] && col === newMove[1]){
      		return 'img/newblackStone.png';
      	}
      	return 'img/blackStone.png';
      }
      if(piece === 'O'){
      	if(row === newMove[0] && col === newMove[1]){
      		return 'img/newwhiteStone.png';
      	}
      	return 'img/whiteStone.png'
      }
    }

    export function shouldSlowlyAppear(row : any, col : any) {
      return delta !== undefined
          && delta.row === row && delta.col === col;
    }

    export function cellClicked(row : any, col : any) {
      log.info(["Clicked on cell:", row, col]);
      if (!isYourTurn) {
        return;
      }
      try {
        if (!isAiWorking){
          // isAiWorking = true;
          var move = gameLogic.createMove(board, row, col, turnIndex);
          newMove = [row, col];
          isYourTurn = false; // to prevent making another move
          gameService.makeMove(move);
          //isFinished = updateMessage(move);
          numOfMoves++;
          // aiService.informingComputer(row, col, 'black');
          // log.info("got here");
          // if(!isFinished){
          //   document.getElementById("gamemsg").innerHTML = "AI thinking...";
          // }
        }
        else{
        	return false;
        }
      } catch (e) {
        log.info(e);
        log.info(["Cell is already full in position:", row, col]);
        return;
      }
    };

    export function onStartCallback() {
      log.info("onStart happened!", arguments);
    };


  //scaleBodyService.scaleBody({width: 1200, height: 1200});
  //   gameService.setGame({
  //     gameDeveloperEmail: "punk0706@gmail.com",
  //     minNumberOfPlayers: 2,
  //     maxNumberOfPlayers: 2,
  //     exampleGame: gameLogic.getExampleGame(),
  //     riddles: gameLogic.getRiddles(),
  //     isMoveOk: gameLogic.isMoveOk,
  //     updateUI: updateUI
  //   });
  // });
}

angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
  .run(function () {
  $rootScope['game'] = game;
  translate.setLanguage('en',  {
    RULES_OF_GOMOKU:"Rules of Gomoku",
  	RULES_SLIDE1: "In Gomoku, each player takes turns placing a stone on the board, starting with black.",
  	RULES_SLIDE2: "The first player to connect 5 of their pieces in a row, either horizontially, vertically or diagonally is declared the winner.",
  	CLOSE:"Close"
  });
  game.init();
});
