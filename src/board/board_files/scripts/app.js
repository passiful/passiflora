window.app = new (function(){
	// app "board"
	var socket = this.socket = window.biflora
		.createSocket(
			new (function(){})(),
			io,
			{}
		)
	;

})();
