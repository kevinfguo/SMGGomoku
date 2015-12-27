/*jslint devel: true, indent: 2 */
/*jslint white: false */
/*global console */
//I have implemented a simple HTML UI in the test.html and you can test the game logic by actually play the game thru the UI
//The following code was tested and confirmed functionality by pasting and running in google chrome console
// 'use strict';
// angular.module('myApp').service('gameLogic', function() {
var gameLogic;
(function (gameLogic) {
    'use strict';
    function isEqual(object1, object2) {
        return JSON.stringify(object1) === JSON.stringify(object2);
    }
    gameLogic.isEqual = isEqual;
    function copyObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
    gameLogic.copyObject = copyObject;
    //this method creates an empty board
    function createNewBoard() {
        var newBoard = [];
        var i;
        for (i = 0; i < 15; i++) {
            newBoard[newBoard.length] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        }
        return newBoard;
    }
    gameLogic.createNewBoard = createNewBoard;
    //The following four method take the board, row, col and a coloy(X or O) as input
    //Check all four possible directions from a position with a specific color and
    //return the longest connecting sequence passing thru the given position for the given color
    function checkHorizontal(board, row, col, color) {
        var sameColors = [[row, col]];
        var i;
        for (i = 1; i < 15; i++) {
            if (col + i < 15 && board[row][col + i] === color) {
                sameColors[sameColors.length] = [row, col + i];
            }
            else {
                break;
            }
        }
        for (i = 1; i < 15; i++) {
            if (col - i >= 0 && board[row][col - i] === color) {
                sameColors[sameColors.length] = [row, col - i];
            }
            else {
                break;
            }
        }
        return sameColors;
    }
    gameLogic.checkHorizontal = checkHorizontal;
    function checkBackSlash(board, row, col, color) {
        var sameColors = [[row, col]];
        var i;
        for (i = 1; i < 15; i++) {
            if (col + i < 15 && row + i < 15 && board[row + i][col + i] === color) {
                sameColors[sameColors.length] = [row + i, col + i];
            }
            else {
                break;
            }
        }
        for (i = 1; i < 15; i++) {
            if (col - i >= 0 && row - i >= 0 && board[row - i][col - i] === color) {
                sameColors[sameColors.length] = [row - i, col - i];
            }
            else {
                break;
            }
        }
        return sameColors;
    }
    gameLogic.checkBackSlash = checkBackSlash;
    function checkForwardSlash(board, row, col, color) {
        var sameColors = [[row, col]];
        var i;
        for (i = 1; i < 15; i++) {
            if (col - i >= 0 && row + i < 15 && board[row + i][col - i] === color) {
                sameColors[sameColors.length] = [row + i, col - i];
            }
            else {
                break;
            }
        }
        for (i = 1; i < 15; i++) {
            if (col + i < 15 && row - i >= 0 && board[row - i][col + i] === color) {
                sameColors[sameColors.length] = [row - i, col + i];
            }
            else {
                break;
            }
        }
        return sameColors;
    }
    gameLogic.checkForwardSlash = checkForwardSlash;
    function checkVertical(board, row, col, color) {
        var sameColors = [[row, col]];
        var i;
        for (i = 1; i < 15; i++) {
            if (row + i < 15 && board[row + i][col] === color) {
                sameColors[sameColors.length] = [row + i, col];
            }
            else {
                break;
            }
        }
        for (i = 1; i < 15; i++) {
            if (row - i >= 0 && board[row - i][col] === color) {
                sameColors[sameColors.length] = [row - i, col];
            }
            else {
                break;
            }
        }
        return sameColors;
    }
    gameLogic.checkVertical = checkVertical;
    /** Return the winner (either 'X' or 'O') or '' if there is no winner. */
    function getWinner(winningSequence) {
        if (winningSequence.length > 0) {
            return winningSequence[0];
        }
        else {
            return '';
        }
    }
    gameLogic.getWinner = getWinner;
    //This method check the four directions to see if any has a connecting sequence that has a length
    //exactly equal to five, if yes, return the winning color and sequence
    function getWinningSequence(board, row, col, color) {
        var winningSeuqnece = [];
        if (checkHorizontal(board, row, col, color).length === 5) {
            winningSeuqnece = [color, checkHorizontal(board, row, col, color)];
            return winningSeuqnece;
        }
        if (checkVertical(board, row, col, color).length === 5) {
            winningSeuqnece = [color, checkHorizontal(board, row, col, color)];
            return winningSeuqnece;
        }
        if (checkBackSlash(board, row, col, color).length === 5) {
            winningSeuqnece = [color, checkHorizontal(board, row, col, color)];
            return winningSeuqnece;
        }
        if (checkForwardSlash(board, row, col, color).length === 5) {
            winningSeuqnece = [color, checkHorizontal(board, row, col, color)];
            return winningSeuqnece;
        }
        return winningSeuqnece;
    }
    gameLogic.getWinningSequence = getWinningSequence;
    /** Returns true if the game ended in a tie because there are no empty cells. */
    function isTie(board) {
        var i, j;
        for (i = 0; i < 15; i++) {
            for (j = 0; j < 15; j++) {
                if (board[i][j] === '') {
                    // If there is an empty cell then we do not have a tie.
                    return false;
                }
            }
        }
        // No empty cells --> tie!
        return true;
    }
    gameLogic.isTie = isTie;
    //The following two method:createMove and isMoveOk reused large portion of the code
    //from the Professor's TicTacToe sample
    /**
       * Returns the move that should be performed when player
       * with index turnIndexBeforeMove makes a move in cell row X col.
       */
    function createMove(board, row, col, turnIndexBeforeMove) {
        if (board === undefined) {
            // Initially (at the beginning of the match), the board in state is undefined.
            board = createNewBoard();
        }
        if (board[row][col] !== '') {
            throw new Error("One can only make a move in an empty position!");
        }
        var boardAfterMove = copyObject(board);
        var turnColor = turnIndexBeforeMove === 0 ? 'X' : 'O';
        boardAfterMove[row][col] = turnColor;
        var winner = getWinner(getWinningSequence(boardAfterMove, row, col, turnColor));
        var firstOperation;
        if (winner !== '' || isTie(boardAfterMove)) {
            // Game over.
            firstOperation = { endMatch: { endMatchScores: (winner === 'X' ? [1, 0] : (winner === 'O' ? [0, 1] : [0, 0])) } };
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            firstOperation = { setTurn: { turnIndex: 1 - turnIndexBeforeMove } };
        }
        return [firstOperation,
            { set: { key: 'board', value: boardAfterMove } },
            { set: { key: 'delta', value: { row: row, col: col } } }];
    }
    gameLogic.createMove = createMove;
    function isMoveOk(params) {
        var move = params.move;
        var turnIndexBeforeMove = params.turnIndexBeforeMove;
        var stateBeforeMove = params.stateBeforeMove;
        // The state and turn after move are not needed in TicTacToe (or in any game where all state is public).
        //var turnIndexAfterMove = params.turnIndexAfterMove;
        //var stateAfterMove = params.stateAfterMove;
        // We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
        // to verify that move is legal.
        try {
            // Example move:
            // [{setTurn: {turnIndex : 1},
            //  {set: {key: 'board', value: [['X', '', ''], ['', '', ''], ['', '', '']]}},
            //  {set: {key: 'delta', value: {row: 0, col: 0}}}]
            var deltaValue = move[2].set.value;
            var row = deltaValue.row;
            var col = deltaValue.col;
            var board = stateBeforeMove.board;
            var expectedMove = createMove(board, row, col, turnIndexBeforeMove);
            if (!isEqual(move, expectedMove)) {
                return false;
            }
        }
        catch (e) {
            // if there are any exceptions then the move is illegal
            return false;
        }
        return true;
    }
    gameLogic.isMoveOk = isMoveOk;
    function getExampleMoves(initialTurnIndex, initialState, arrayOfRowColComment) {
        var exampleMoves = [];
        var state = initialState;
        var turnIndex = initialTurnIndex;
        for (var i = 0; i < arrayOfRowColComment.length; i++) {
            var rowColComment = arrayOfRowColComment[i];
            var move = createMove(state.board, rowColComment.row, rowColComment.col, turnIndex);
            var stateAfterMove = { board: move[1].set.value, delta: move[2].set.value };
            exampleMoves.push({
                stateBeforeMove: state,
                stateAfterMove: stateAfterMove,
                turnIndexBeforeMove: turnIndex,
                turnIndexAfterMove: 1 - turnIndex,
                move: move,
                comment: { en: rowColComment.comment } });
            state = stateAfterMove;
            turnIndex = 1 - turnIndex;
        }
        return exampleMoves;
    }
    gameLogic.getExampleMoves = getExampleMoves;
    function getRiddles() {
        return [
            getExampleMoves(0, { board: [['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', 'X', 'X', 'X', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', 'O', 'O', 'O', '', '', '', '', '', '', '', '', '', ''],
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
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']], delta: { row: 3, col: 4 } }, [
                { row: 2, col: 5, comment: "Find the position for X where he could win in his next turn by having 5 connected Xs in one direction" },
                { row: 2, col: 1, comment: "O played to try to block X" },
                { row: 2, col: 6, comment: "X wins by having five Xs in one direction." }
            ]),
            getExampleMoves(1, { board: [['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', 'X', 'X', 'X', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', 'O', 'O', 'O', 'X', '', '', '', '', '', '', '', ''],
                    ['', '', '', 'O', '', 'X', 'X', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', 'O', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']], delta: { row: 3, col: 4 } }, [
                { row: 3, col: 2, comment: "O places here will lead to winning in 2 more rounds" },
                { row: 3, col: 1, comment: "X places here to avoid O from winning" },
                { row: 2, col: 1, comment: "O will win next round." },
                { row: 1, col: 2, comment: "X played to try to block O" },
                { row: 6, col: 5, comment: "O wins by having five Os in one direction." }
            ])
        ];
    }
    gameLogic.getRiddles = getRiddles;
    function getExampleGame() {
        return getExampleMoves(0, {}, [
            { row: 6, col: 6, comment: "X starts the game by placing near the middle of the board" },
            { row: 7, col: 6, comment: "O places next to the X's first move" },
            { row: 6, col: 7, comment: "X plces next to its first move" },
            { row: 7, col: 7, comment: "O places next to its original move" },
            { row: 8, col: 9, comment: "X places on 8, 9" },
            { row: 7, col: 8, comment: "O forms an open three on 7, 8" },
            { row: 7, col: 9, comment: "X blocks O by putting on 7, 9" },
            { row: 8, col: 6, comment: "O places on 8, 6" },
            { row: 6, col: 9, comment: "X places on 6,9 and forming two open threes, X will win" },
            { row: 6, col: 8, comment: "O trying to block X by placing on 6,8" },
            { row: 5, col: 9, comment: "X places on 5,9, forming an open four" },
            { row: 4, col: 9, comment: "O tring to block X by putting on 4, 9" },
            { row: 9, col: 9, comment: "X wins by placing at 9, 9" }
        ]);
    }
    gameLogic.getExampleGame = getExampleGame;
})(gameLogic || (gameLogic = {}));
;// 'use strict';
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
;// 'use strict';
// angular.module('myApp').service('aiService', function() {
var aiService;
(function (aiService) {
    'use strict';
    var mapPoint = (function () {
        function mapPoint(r, c) {
            r = r;
            c = c;
            this.set = false;
            this.score = 0;
            this.valid = false;
            this.info = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        }
        return mapPoint;
    })();
    // var ai={};
    var sum = 0;
    var setNum = 0;
    var scopeMap = [];
    var scorequeue = [];
    var map = [];
    var moves = [
        [-1, -1],
        [-1, 0],
        [0, -1],
        [-1, 1]
    ];
    var coe = [-2, 1];
    var scores = [0, 1, 10, 2000, 4000, 100000000000];
    var cache;
    var otc;
    var depth;
    var totry;
    var myColor;
    for (var i = 0; i < 15; i++) {
        var tmp = [];
        for (var j = 0; j < 15; j++) {
            var a = new mapPoint(i, j);
            tmp.push(a);
            scorequeue.push(a);
        }
        map.push(tmp);
    }
    var boardBuf = new ArrayBuffer(255);
    var boardBufArr = new Uint8Array(boardBuf);
    function bufToString() {
        return String.fromCharCode.apply(null, boardBufArr);
    }
    aiService.bufToString = bufToString;
    function ini(mode, color) {
        myColor = color;
        if (color == 'black') {
            otc = 'white';
        }
        else {
            otc = 'black';
        }
        switch (mode) {
            case 'easy':
                depth = 5;
                totry = [12, 8];
                break;
            case 'hard':
                depth = 7;
                totry = [10, 10];
                break;
            default:
                console.log('ini erro');
        }
        console.log('ini complete');
    }
    aiService.ini = ini;
    ;
    function watch(r, c, color) {
        console.log("row, col: ", r, c, "color: ", color);
        updateMap(r, c, color);
        if (color == 'remove') {
            setNum--;
        }
        else
            setNum++;
        scorequeue.sort(sortMove);
    }
    aiService.watch = watch;
    function updateMap(r, c, color) {
        var remove = false, num;
        if (color == myColor) {
            num = 1;
        }
        else if (color == otc) {
            num = 0;
        }
        else {
            remove = true;
            num = map[r][c].set - 1;
        }
        console.log("Got here");
        return _updateMap(r, c, num, remove);
    }
    aiService.updateMap = updateMap;
    ;
    function _updateMap(r, c, num, remove) {
        var i = 4, x, y, step, tmp, xx, yy, cur, changes = 0, s, e;
        if (!remove) {
            console.log("Got here: Branch 1");
            boardBufArr[r * 15 + c] = num + 2;
            map[r][c].set = num + 1;
            while (i--) {
                x = r;
                y = c;
                step = 5;
                while (step-- && x >= 0 && y >= 0 && y < 15) {
                    xx = x - moves[i][0] * 4;
                    yy = y - moves[i][1] * 4;
                    if (xx >= 15 || yy < 0 || yy >= 15) {
                        x += moves[i][0];
                        y += moves[i][1];
                        continue;
                    }
                    cur = map[x][y].info[i];
                    if (cur[2] > 0) {
                        tmp = 5;
                        xx = x;
                        yy = y;
                        s = scores[cur[2]];
                        changes -= s * cur[3];
                        while (tmp--) {
                            map[xx][yy].score -= s;
                            xx -= moves[i][0];
                            yy -= moves[i][1];
                        }
                    }
                    cur[num]++;
                    if (cur[1 - num] > 0) {
                        cur[2] = 0;
                    }
                    else {
                        cur[2] = cur[num];
                        e = coe[num];
                        cur[3] = e;
                        s = scores[cur[2]];
                        tmp = 5;
                        xx = x;
                        yy = y;
                        changes += s * cur[3];
                        while (tmp--) {
                            map[xx][yy].score += s;
                            xx -= moves[i][0];
                            yy -= moves[i][1];
                        }
                    }
                    x += moves[i][0];
                    y += moves[i][1];
                }
            }
        }
        else {
            console.log("Got here: Branch 2");
            boardBufArr[r * 15 + c] = 0;
            map[r][c].set = false;
            while (i--) {
                x = r;
                y = c;
                step = 5;
                //others 0 i am 1-> sc=0
                //others 0 i am more than 1-> sc=1
                //i am >0 others >0 -> sc=-1
                while (step-- && x >= 0 && y >= 0 && y < 15) {
                    xx = x - moves[i][0] * 4;
                    yy = y - moves[i][1] * 4;
                    if (xx >= 15 || yy < 0 || yy >= 15) {
                        x += moves[i][0];
                        y += moves[i][1];
                        continue;
                    }
                    cur = map[x][y].info[i];
                    var sc = 0;
                    cur[num]--;
                    if (cur[2] > 0) {
                        tmp = 5;
                        xx = x;
                        yy = y;
                        s = scores[cur[2]];
                        changes -= s * cur[3];
                        while (tmp--) {
                            map[xx][yy].score -= s;
                            xx -= moves[i][0];
                            yy -= moves[i][1];
                        }
                        cur[2]--;
                        if (cur[num] > 0)
                            sc = 1;
                    }
                    else if (cur[1 - num] > 0 && !cur[num]) {
                        sc = -1;
                    }
                    if (sc === 1) {
                        tmp = 5;
                        s = scores[cur[2]];
                        xx = x;
                        yy = y;
                        changes += s * cur[3];
                        while (tmp--) {
                            map[xx][yy].score += s;
                            //if(!map[xx][yy].set)changes+=s*cur[3];
                            xx -= moves[i][0];
                            yy -= moves[i][1];
                        }
                    }
                    else if (sc === -1) {
                        cur[2] = cur[1 - num];
                        tmp = 5;
                        s = scores[cur[2]];
                        cur[3] = coe[1 - num];
                        xx = x;
                        yy = y;
                        changes += s * cur[3];
                        while (tmp--) {
                            map[xx][yy].score += s;
                            //if(!map[xx][yy].set)changes+=s*cur[3];
                            xx -= moves[i][0];
                            yy -= moves[i][1];
                        }
                    }
                    x += moves[i][0];
                    y += moves[i][1];
                }
            }
        }
        sum += changes;
    }
    aiService._updateMap = _updateMap;
    ;
    function simulate(x, y, num) {
        setNum++;
        _updateMap(x, y, num, false);
    }
    aiService.simulate = simulate;
    ;
    function desimulate(x, y, num) {
        _updateMap(x, y, num, true);
        setNum--;
    }
    aiService.desimulate = desimulate;
    ;
    function sortMove(a, b) {
        if (a.set)
            return 1;
        if (b.set)
            return -1;
        if (a.score < b.score) {
            return 1;
        }
        else
            return -1;
    }
    aiService.sortMove = sortMove;
    ;
    cache = {};
    function nega(x, y, depth, alpha, beta) {
        var pt = map[x][y].info, i = 4, num = depth % 2;
        simulate(x, y, num);
        var bufstr = bufToString();
        if (cache[bufstr]) {
            return cache[bufstr];
        }
        if (Math.abs(sum) >= 10000000)
            return -1 / 0;
        if (setNum === 225) {
            return 0;
        }
        else if (depth === 0) {
            return sum;
        }
        scorequeue.sort(sortMove);
        var i = totry[num], tmp, tmpqueue = [], b = beta;
        while (i--) {
            tmp = scorequeue[i];
            if (tmp.set)
                continue;
            tmpqueue.push(tmp.c);
            tmpqueue.push(tmp.r);
        }
        depth -= 1;
        i = tmpqueue.length - 1;
        x = tmpqueue[i];
        y = tmpqueue[--i];
        var score = -nega(x, y, depth, -b, -alpha);
        desimulate(x, y, depth % 2);
        if (score > alpha) {
            bufstr = bufToString();
            cache[bufstr] = score;
            alpha = score;
        }
        if (alpha >= beta) {
            bufstr = bufToString();
            cache[bufstr] = beta;
            return alpha;
        }
        b = alpha + 1;
        while (i--) {
            x = tmpqueue[i];
            y = tmpqueue[--i];
            score = -nega(x, y, depth, -b, -alpha);
            desimulate(x, y, depth % 2);
            if (alpha < score && score < beta) {
                score = -nega(x, y, depth, -beta, -alpha);
                desimulate(x, y, depth % 2);
            }
            if (score > alpha) {
                alpha = score;
            }
            if (alpha >= beta) {
                return alpha;
            }
            b = alpha + 1;
        }
        return alpha;
    }
    aiService.nega = nega;
    ;
    function move() {
        cache = {};
        var alpha = -1 / 0, beta = 1 / 0, bestmove = [scorequeue[0].r, scorequeue[0].c];
        var i = 20, tmp, tmpqueue = [], depth = depth;
        while (i--) {
            tmp = scorequeue[i];
            if (tmp.score.set)
                continue;
            tmpqueue.push(tmp.c);
            tmpqueue.push(tmp.r);
        }
        i = tmpqueue.length - 1;
        var x, y, b = beta;
        x = tmpqueue[i];
        y = tmpqueue[--i];
        var score = -nega(x, y, depth, -b, -alpha);
        desimulate(x, y, depth % 2);
        if (score > alpha) {
            alpha = score;
            bestmove = [x, y];
        }
        b = alpha + 1;
        while (i--) {
            x = tmpqueue[i];
            y = tmpqueue[--i];
            score = -nega(x, y, depth, -b, -alpha);
            desimulate(x, y, depth % 2);
            if (alpha < score && score < beta) {
                score = -nega(x, y, depth, -beta, -alpha);
                desimulate(x, y, depth % 2);
            }
            if (score > alpha) {
                alpha = score;
                bestmove = [x, y];
            }
            b = alpha + 1;
        }
        return bestmove;
    }
    aiService.move = move;
    ;
    function iniComputer(d) {
        if (d === undefined) {
            ini('hard', 'white');
        }
        else {
            ini(d, 'white');
        }
    }
    aiService.iniComputer = iniComputer;
    function informingComputer(r, c, color) {
        watch(r, c, color);
    }
    aiService.informingComputer = informingComputer;
    function getMove() {
        var bestmove = move();
        return bestmove;
    }
    aiService.getMove = getMove;
})(aiService || (aiService = {}));
