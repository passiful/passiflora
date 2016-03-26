/**
 * board.js
 */
module.exports = function(conf){
	delete(require.cache[require('path').resolve(__filename)]);
	var fs = require('fs');
	var fsX = require('fs-extra');
	var utils79 = require('utils79');

	/**
	 * 新しいボードを生成する
	 */
	this.createNewBoard = function( boardInfo, callback ){
		if( typeof(boardInfo) == typeof('') ){
			boardInfo = {'theme': boardInfo};
		}else{
			boardInfo = boardInfo || {'theme': 'no title'};
		}
		callback = callback || function(){};

		while(1){

			try {
				var newBoardId = (+new Date());
				console.log(newBoardId);
				var newDirPath = require('path').resolve(conf.dataDir, ''+newBoardId);
				// console.log(newDirPath);

				// ディレクトリ作成
				fs.mkdirSync(newDirPath);
				console.log('SUCCESS...!');

				// info.json 生成
				fs.writeFileSync(require('path').resolve(newDirPath, 'info.json'), JSON.stringify(boardInfo, null, 1));

				// 返却
				callback(newBoardId);
				break;

			} catch (e) {
				console.log('catched.', e.message);
				continue;
			}

		}
		return;
	}

}
