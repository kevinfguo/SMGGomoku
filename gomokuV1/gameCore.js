/*jslint devel: true, indent: 2 */
/*jslint white: false */
/*global console */
//I have implemented a simple HTML UI in the test.html and you can test the game logic by actually play the game thru the UI
//The following code was tested and confirmed functionality by pasting and running in google chrome console
var isMoveOk = (function () {
'use strict';
function isEqual(object1, object2) {
return JSON.stringify(object1) === JSON.stringify(object2);
}
function copyObject(object) {
return JSON.parse(JSON.stringify(object));
}
//this method creates an empty board
function createNewBoard(){
	var newBoard = [];
	var i;
	for(i = 0; i < 15; i++) {
		newBoard[newBoard.length] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
	}
	return newBoard;
}
//The following four method take the board, row, col and a coloy(X or O) as input
//Check all four possible directions from a position with a specific color and
//return the longest connecting sequence passing thru the given position for the given color
function checkHorizontal(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (col + i <15 && board[row][col + i] === color){
			sameColors[sameColors.length] = [row, col + i];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(col - i >= 0 && board[row][col - i] === color){
			sameColors[sameColors.length] = [row, col - i];
		}
		else{
			break;
		}
	}
	return sameColors;
}
function checkBackSlash(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (col + i <15 && row + i < 15 && board[row + i][col + i] === color){
			sameColors[sameColors.length] = [row + i, col + i];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(col - i >= 0 && row - i >= 0 && board[row - i][col - i] === color){
			sameColors[sameColors.length] = [row - i, col - i];
		}
		else{
			break;
		}
	}
	return sameColors;
}
function checkForwardSlash(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (col - i > 0 && row + i < 15 && board[row + i][col - i] === color){
			sameColors[sameColors.length] = [row + i, col - i];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(col + i < 15  && row - i >= 0 && board[row - i][col + i] === color){
			sameColors[sameColors.length] = [row - i, col + i];
		}
		else{
			break;
		}
	}
	return sameColors;
}
function checkVertical(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (row + i <15 && board[row + i][col] === color){
			sameColors[sameColors.length] = [row + i, col];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(row - i >= 0 && board[row - i][col] === color){
			sameColors[sameColors.length] = [row - i, col];
		}
		else{
			break;
		}
	}
	return sameColors;
}


/** Return the winner (either 'X' or 'O') or '' if there is no winner. */
function getWinner(winningSequence){
	if(winningSequence.length > 0){
		return winningSequence[0];
	}
	else{
		return '';
	}
}
//This method check the four directions to see if any has a connecting sequence that has a length
//exactly equal to five, if yes, return the winning color and sequence
function getWinningSequence(board, row, col, color) {
	var winningSeuqnece = [];
if(checkHorizontal(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
if(checkVertical(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
if(checkBackSlash(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
if(checkForwardSlash(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
return winningSeuqnece;
}
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
//The following two method:createMove and isMoveOk reused large portion of the code
//from the Professor's TicTacToe sample
/** 
   * Returns the move that should be performed when player 
   * with index turnIndexBeforeMove makes a move in cell row X col. 
   */
function createMove(board, row, col, turnIndexBeforeMove) {
var boardAfterMove = copyObject(board);
var turnColor = turnIndexBeforeMove === 0 ? 'X' : 'O';
boardAfterMove[row][col] = turnColor;
var winner = getWinner(getWinningSequence(board, row, col, turnColor));
var firstOperation;
if (winner !== '' || isTie(board)) {
// Game over.
firstOperation = {endMatch: {endMatchScores: 
(winner === 'X' ? [1, 0] : (winner === 'O' ? [0, 1] : [0, 0]))}};
} else {
// Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
}
return [firstOperation,
{set: {key: 'board', value: boardAfterMove}},
{set: {key: 'delta', value: {row: row, col: col}}}];
}
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
if (board === undefined) {
// Initially (at the beginning of the match), stateBeforeMove is {}. 
board = createNewBoard();
}
// One can only make a move in an empty position 
if (board[row][col] !== '') {
return false;
}
var expectedMove = createMove(board, row, col, turnIndexBeforeMove);
if (!isEqual(move, expectedMove)) {
return false;
}
} catch (e) {
// if there are any exceptions then the move is illegal
return false;
}
return true;
}
// Manual testing, following method and variabls for testing purpose only
//All legal moves, i.e. isMoveOk return true, would print out a board presentation to console after move
function printBoard(bd){
	var boardstring ='                       1 1 1 1 1 ';
	boardstring += '\n';
	boardstring += '   0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 ';
	var i, u;
	for (i = 0;  i < 15; i++){
		boardstring = boardstring + '\n';
		if (i < 10){
		boardstring += ' ';
		boardstring = boardstring + i;
		}
		else{
			boardstring = boardstring + i;
		}
		boardstring = boardstring + ' ';
		for( u = 0; u < 15; u++){
			if(bd[i][u] === ''){
				boardstring = boardstring + '- ';
			}
			else{
				boardstring = boardstring + bd[i][u];
				boardstring = boardstring + ' ';
			}
		}
	}
	console.log(boardstring);
	return boardstring;
}
var testingBoard = createNewBoard();
function testingMove(row, col, color){
	var bd = copyObject(testingBoard);
	bd[row][col] = color;
	return bd;
}
// Check placing X in 4x5 from initial state.
console.log('Test 1: Check placing X in 4x5 from initial state, expected true');
var test1 = isMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {}, 
move: [{setTurn: {turnIndex : 1}},
{set: {key: 'board', value: testingMove(4, 5, 'X')}},
{set: {key: 'delta', value: {row: 4, col: 5}}}]});
console.log(test1);
if(test1){
	testingBoard[4][5] = 'X';
	printBoard(testingBoard);
	
}
//Check placing O in 5x5 from previous state.
console.log('Test 2: Check placing O in 5x5 from previous state, expected true');
var test2 = isMoveOk({turnIndexBeforeMove: 1, 
    stateBeforeMove: {board: testingBoard, delta: {row: 4, col: 5}}, 
    move: [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: testingMove(5, 5, 'O')}},
      {set: {key: 'delta', value: {row: 5, col: 5}}}]});
console.log(test2);
if(test2){
	testingBoard[5][5] = 'O';
	printBoard(testingBoard);
}
//Check illegal move with wrong operation after move
console.log('Test 3: Check illegal move with wrong operation after move, expected false');
var test3 = isMoveOk({turnIndexBeforeMove: 0, 
    stateBeforeMove: {board: testingBoard, delta: {row: 5, col: 5}}, 
    move: [{endMatch: {endMatchScores: [1, 0]}},
      {set: {key: 'board', value: testingMove(2, 0, 'X')}},
      {set: {key: 'delta', value: {row: 2, col: 0}}}]});
console.log(test3);
//Check illegal move with placing on a occupied spot
console.log('Test 4: Check illegal move with placing on a occupied spot, expected false');
var test4 = isMoveOk({turnIndexBeforeMove: 0, 
      stateBeforeMove: {board: testingBoard, delta: {row: 5, col: 5}}, 
      move: [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: testingMove(5, 5, 'X')}},
        {set: {key: 'delta', value: {row: 5, col: 5}}}]});
console.log(test4);
//Check illegal move with a player moved two times in a roll
console.log('Test5: Check illegal move with a player attempting to move two times in a roll, expected false');
var test5 = isMoveOk({turnIndexBeforeMove: 0, 
    stateBeforeMove: {board: testingBoard, delta: {row: 5, col: 5}}, 
    move: [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: testingMove(5, 6, 'O')}},
      {set: {key: 'delta', value: {row: 5, col: 6}}}]});
console.log(test5);
//legal move, player0 places on 5, 6
console.log('Test 6: Check placing X in 5x6 from previous state, expected true');
var test6 = isMoveOk({turnIndexBeforeMove: 0, 
    stateBeforeMove: {board: testingBoard, delta: {row: 5, col: 5}}, 
    move: [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: testingMove(5, 6, 'X')}},
      {set: {key: 'delta', value: {row: 5, col: 6}}}]});
console.log(test6);
if(test6){
	testingBoard[5][6] = 'X';
	printBoard(testingBoard);
}
//legal move, player1 places on 6, 6
console.log('Test 7: Check placing O in 6x6 from previous state, expected true');
var test7 = isMoveOk({turnIndexBeforeMove: 1, 
    stateBeforeMove: {board: testingBoard, delta: {row: 5, col: 6}}, 
    move: [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: testingMove(6, 6, 'O')}},
      {set: {key: 'delta', value: {row: 6, col: 6}}}]});
console.log(test7);
if(test7){
	testingBoard[6][6] = 'O';
	printBoard(testingBoard);
}
//legal move, player0 places on 6, 7
console.log('Test 8: Check placing X in 6x7 from previous state, expected true');
var test8 = isMoveOk({turnIndexBeforeMove: 0, 
    stateBeforeMove: {board: testingBoard, delta: {row: 6, col: 6}}, 
    move: [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: testingMove(6, 7, 'X')}},
      {set: {key: 'delta', value: {row: 6, col: 7}}}]});
console.log(test8);
if(test8){
	testingBoard[6][7] = 'X';
	printBoard(testingBoard);
}
//legal move, player1 places on 7, 7
console.log('Test 9: Check placing O in 7x7 from previous state, expected true');
var test9 = isMoveOk({turnIndexBeforeMove: 1, 
    stateBeforeMove: {board: testingBoard, delta: {row: 6, col: 7}}, 
    move: [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: testingMove(7, 7, 'O')}},
      {set: {key: 'delta', value: {row: 7, col: 7}}}]});
console.log(test9);
if(test9){
	testingBoard[7][7] = 'O';
	printBoard(testingBoard);
}
//legal move, player0 places on 7, 8
console.log('Test 10: Check placing X in 7x8 from previous state, expected true');
var test10 = isMoveOk({turnIndexBeforeMove: 0, 
    stateBeforeMove: {board: testingBoard, delta: {row: 7, col: 7}}, 
    move: [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: testingMove(7, 8, 'X')}},
      {set: {key: 'delta', value: {row: 7, col: 8}}}]});
console.log(test10);
if(test10){
	testingBoard[7][8] = 'X';
	printBoard(testingBoard);
}
//legal move, player1 places on 8, 8
console.log('Test 11: Check placing O in 8x8 from previous state, expected true');
var test11 = isMoveOk({turnIndexBeforeMove: 1, 
    stateBeforeMove: {board: testingBoard, delta: {row: 7, col: 8}}, 
    move: [{setTurn: {turnIndex : 0}},
      {set: {key: 'board', value: testingMove(8, 8, 'O')}},
      {set: {key: 'delta', value: {row: 8, col: 8}}}]});
console.log(test11);
if(test11){
	testingBoard[8][8] = 'O';
	printBoard(testingBoard);
}
//legal move, end game with player0 place on 8,9 and win
console.log('Test 11: Check end game with placing X on 8,9 and win, expected true');
var test12 = isMoveOk({turnIndexBeforeMove: 0, 
    stateBeforeMove: {board: testingBoard, delta: {row: 8, col: 8}}, 
    move: [{endMatch: {endMatchScores: [1, 0]}},
      {set: {key: 'board', value: testingMove(8, 9, 'X')}},
      {set: {key: 'delta', value: {row: 8, col: 9}}}]});
console.log(test12);
if(test12){
	testingBoard[8][9] = 'X';
	printBoard(testingBoard);
}
//The reason this module will retrun these three memebr functions because I implemented a simple but playable UI in the test.html file
//and I would need the following functions to create the game.
return {
	isMoveOk: isMoveOk,
	createNewBoard: createNewBoard,
	createMove: createMove
};
})();
