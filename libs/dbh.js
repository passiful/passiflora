/**
 * dbh.js
 */
module.exports = function(conf, app){
	delete(require.cache[require('path').resolve(__filename)]);
	var fs = require('fs');
	var fsX = require('fs-extra');
	var utils79 = require('utils79');
	var Sequelize = require('sequelize');
	var sqlite = require('sqlite3');
	var dbs = {};

	/**
	 * DBを初期化
	 * @param  {String}   boardId  [description]
	 * @param  {Function} callback [description]
	 * @return {Void}              void.
	 */
	this.initDb = function(boardId, callback){
		callback = callback || function(){};
		if(dbs[boardId]){
			callback(dbs[boardId]);
			return;
		}

		var dbPath = require('path').resolve(conf.dataDir, ''+boardId, 'db.sqlite');
		// console.log(dbPath);

		var sequelize = new Sequelize(undefined, undefined, undefined, {
			'dialect': 'sqlite',
			'connection': new sqlite.Database( dbPath ),
			'storage': dbPath
		});

		var tbls = {};
		tbls.timeline = sequelize.define('timeline',
			{
				'content': { type: Sequelize.STRING },
				'contentType': { type: Sequelize.STRING },
				'owner': { type: Sequelize.STRING },
				'microtime': { type: Sequelize.BIGINT }
			}
		);
		sequelize.sync();

		// ボード情報を記憶
		dbs[boardId] = {};
		dbs[boardId].boardId = boardId;
		dbs[boardId].path = dbPath;
		dbs[boardId].tbls = tbls;
		console.log(dbs);

		callback(dbs[boardId]);
		return;
	}

}
