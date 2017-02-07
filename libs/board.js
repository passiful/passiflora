/**
 * board.js
 */
module.exports = function(conf, incense, main){

	/**
	 * 新しいボードを生成する
	 */
	this.createNewBoard = function( boardInfo, callback ){
		incense.board.createNewBoard(callback);
		return;
	}

	/**
	 * ボード情報を取得する
	 */
	this.getBoardInfo = function(boardId, callback){
		incense.board.getBoardInfo(boardId, callback);
		return;
	}

}
