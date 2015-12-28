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
        console.log("Translation of 'RULES_OF_OWARE' is " + translate('RULES_OF_OWARE'));
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
        RULES_OF_OWARE: "Rules of OWARE",
        RULES_SLIDE1: "To sow you must take all the seeds of  any of your holes and lay its out along the holes against the direction of the clockwise. In every hole you should lay it out one seed.  If you reach the last hole of your ground you must continue in the land of the other player. Remember, you always have to lay out seeds in the direction against the clockwise.",
        RULES_SLIDE2: "If the last hole where you sow is in the land of the other player and there are two or three seeds in the last hole remove from the board and keep them. If the previous holes also contain two or three seeds also remove them and remove all the seeds of your opponent that contains two or three seeds.",
        RULES_SLIDE3: "As the game progresses, it is possible that one hole contains more than 12 seeds. This hole is called Kroo and makes possible complete one round. When the harvest starts at the Kroo, this hole must finish empty what means that the player shouldn’t lay out any seed.",
        RULES_SLIDE4: "To play a run  and  leaves the other player with no seeds to continue playing is not allowed. If you do it you will lose the game.",
        RULES_SLIDE5: "If the other player has only one seed in his field you will have to remove it in order to harvest and continue playing. Players must provide in advance to avoid this situation. If this is impossible, because we only have one seed in our land. The game is finished. The winner is the one that harvest more.",
        RULES_SLIDE6: "Game ends with a player having more than 23 seeds in his house. When there are few seeds left on the counter, the game may be perpetuating and hardly any of the 2 players can capture any new seed. By mutual agreement player can agree the end of the game. In this case every player is the owner of the seeds in his side.  As always, who has garnered more wins the match.",
        CLOSE: "Close"
    });
    game.init();
});
