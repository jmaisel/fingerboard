/**
 * Represents a string on a fingerboard
 */
guitharmony.FingerboardString = function(config){
	
	var that = {
		fingerboard : config.fingerboard,
		line : config.line,
		
		noteAt : function(frt){
			return teoria.note.fromKey(that.open().key() + frt);
		},
		getFret : function(note){
			var open = that.open();
			
			for( var i=0; i<fb.state().frets; i++ ){
				var fretted = teoria.note.fromKey(open.key() + i);
				
				if( guitharmony.TheoryUtil.isEnharmonic(note, fretted) ){
					return i;
				}
			}
			
			return -1;
		},
		open : function(){
			return teoria.note.fromString(config.openNote);
		},
		tuneTo : function(note){
			config.openNote = note;
		},
		mark : function(notes){
			var result = [];
			
			for( var i=0; i<notes.length; i++ ){
				var fret = that.getFret(notes[i]);
				
				if( fret == -1 )
					continue;
				
				var marker = new guitharmony.FingerboardMarker(config.strNbr, fret, that.fingerboard);
				result.push(marker);
			}
			
			return result;
		}
	};
	
	return that;
}