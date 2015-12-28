// 'use strict';
//
// angular.module('myApp', ['ngTouch'])
//   .controller('Ctrl', function (
//        $window, $scope, $log, $timeout,
//       aiService, gameService, scaleBodyService, gameLogic) {
var game;
(function (game) {
    'use strict';
    var board;
    var delta;
    var numOfMoves;
    var isAiWorking;
    var isYourTurn;
    var turnIndex;
    var newMove;
    var isFinished;
    game.isHelpModalShown = false;
    var moveAudio = new Audio('audio/move.wav');
    moveAudio.load();
    // iniAiService();
    function init() {
        console.log("Translation of 'RULES_OF_GOMOKU' is " + translate('RULES_OF_GOMOKU'));
        resizeGameAreaService.setWidthToHeight(1);
        gameService.setGame({
            minNumberOfPlayers: 2,
            maxNumberOfPlayers: 2,
            isMoveOk: gameLogic.isMoveOk,
            updateUI: updateUI
        });
    }
    game.init = init;
    function updateUI(params) {
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
        }
        else {
            // Only play a sound if there was a move (i.e., state is not empty).
            moveAudio.play();
        }
        isYourTurn = params.turnIndexAfterMove >= 0 &&
            params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        turnIndex = params.turnIndexAfterMove;
        if (isYourTurn && params.playersInfo[params.yourPlayerIndex].playerId === '') {
            // Wait 500 milliseconds until animation ends.
            $timeout(sendComputerMove, 600);
        }
    }
    game.updateUI = updateUI;
    function sendComputerMove() {
        var aimove = [];
        if (numOfMoves < 2) {
            aimove = firstAIMoveGenerator();
        }
        else {
            aimove = aiServiceMakeMove();
        }
        newMove = aimove;
        gameService.makeMove(gameLogic.createMove(board, aimove[0], aimove[1], turnIndex));
        //isFinished = updateMessage(gameLogic.createMove(board, aimove[0], aimove[1], turnIndex));
        aiService.informingComputer(aimove[0], aimove[1], 'white');
        $timeout(updateAIStatues, 500);
        numOfMoves++;
    }
    game.sendComputerMove = sendComputerMove;
    function updateAIStatues() {
        isAiWorking = false;
        // if (!isFinished){
        // 	document.getElementById("gamemsg").innerHTML = "Black's turn";
        // }
    }
    game.updateAIStatues = updateAIStatues;
    updateUI({ stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2 });
    function iniAiService() {
        aiService.iniComputer('hard');
    }
    game.iniAiService = iniAiService;
    function aiServiceMakeMove() {
        return aiService.getMove();
    }
    game.aiServiceMakeMove = aiServiceMakeMove;
    function firstAIMoveGenerator() {
        var moves = [
            [6, 6],
            [6, 7],
            [6, 8],
            [7, 6],
            [7, 7],
            [7, 8],
            [8, 6],
            [8, 7],
            [8, 8]
        ];
        while (true) {
            var ind = Math.floor(Math.random() * moves.length);
            if (board[moves[ind][0]][moves[ind][1]] === '') {
                return [(moves[ind][0]), (moves[ind][1])];
            }
            else {
                moves.splice(ind, 1);
            }
        }
    }
    game.firstAIMoveGenerator = firstAIMoveGenerator;
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
    function placeDot(str, row, col) {
        var piece = board[row][col];
        if (piece === '') {
            return 'img/empty.png';
        }
        if (piece === 'X') {
            if (row === newMove[0] && col === newMove[1]) {
                return 'img/newblackStone.png';
            }
            return 'img/blackStone.png';
        }
        if (piece === 'O') {
            if (row === newMove[0] && col === newMove[1]) {
                return 'img/newwhiteStone.png';
            }
            return 'img/whiteStone.png';
        }
    }
    game.placeDot = placeDot;
    function shouldSlowlyAppear(row, col) {
        return delta !== undefined
            && delta.row === row && delta.col === col;
    }
    game.shouldSlowlyAppear = shouldSlowlyAppear;
    function cellClicked(row, col) {
        log.info(["Clicked on cell:", row, col]);
        if (!isYourTurn) {
            return;
        }
        try {
            if (!isAiWorking) {
                // isAiWorking = true;
                var move = gameLogic.createMove(board, row, col, turnIndex);
                newMove = [row, col];
                isYourTurn = false; // to prevent making another move
                gameService.makeMove(move);
                //isFinished = updateMessage(move);
                numOfMoves++;
            }
            else {
                return false;
            }
        }
        catch (e) {
            log.info(e);
            log.info(["Cell is already full in position:", row, col]);
            return;
        }
    }
    game.cellClicked = cellClicked;
    ;
    function onStartCallback() {
        log.info("onStart happened!", arguments);
    }
    game.onStartCallback = onStartCallback;
    ;
})(game || (game = {}));
angular.module('myApp', ['ngTouch', 'ui.bootstrap', 'gameServices'])
    .run(function () {
    $rootScope['game'] = game;
    translate.setLanguage('en', {
        RULES_OF_GOMOKU: "Rules of Gomoku",
        RULES_SLIDE1: "In Gomoku, each player takes turns placing a stone on the board, starting with black.",
        RULES_SLIDE2: "The first player to connect 5 of their pieces in a row, either horizontially, vertically or diagonally is declared the winner.",
        CLOSE: "Close"
    });
    game.init();
});
