(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * userMgr.js
 */
module.exports = function( app, $timelineList, $field, $fieldInner ){
	var _this = this;
	var userList = {};


	/**
	 * ユーザー情報を登録する
	 */
	this.login = function(connectionId, userInfo, callback){
		callback = callback || function(err, userInfo){};
		userList[connectionId] = userInfo;
		callback(null, userList[connectionId]);
		return;
	}

	/**
	 * ユーザー情報を削除する
	 */
	this.logout = function(connectionId, callback){
		callback = callback || function(err, userInfo){};
		var rtn = userList[connectionId];
		userList[connectionId] = undefined;
		delete(userList[connectionId]);
		callback(null, rtn);
		return;
	}

	/**
	 * ユーザー情報を取得する
	 */
	this.get = function(connectionId){
		return userList[connectionId];
	}

	/**
	 * ユーザー情報を一覧ごと取得する
	 */
	this.getAll = function(){
		return userList;
	}

	return;
}

},{}]},{},[1])