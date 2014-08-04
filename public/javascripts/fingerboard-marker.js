guitharmony.FingerboardMarker = function(stringNbr, fretNbr, fingerboard ){
	var note = fingerboard.noteAt(stringNbr, fretNbr);
	
	var that ={
		notation: note.simple(),
		note: note,
		string: stringNbr,
		fret: fretNbr,
		fingerboard: fingerboard,
		toString : function(){
			return "FingerboardMarker-str:" + that.string + " fret:" + that.fret;
		}
	};
	
	return that;
}