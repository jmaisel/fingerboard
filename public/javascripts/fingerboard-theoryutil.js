guitharmony = {};

/**
 * Helper functions for music theory calculations
 */
guitharmony.TheoryUtil = new function(){
	return{
		
		/** Fairly self explanatory I think...  :) */
		isEnharmonic: function(n1, n2){
			
			var ehs = n1.enharmonics();
			
			for( var i in ehs ){
				if( n1.simple() === n2.simple() || ehs[i].simple() === n2.simple() ) 
					return true;
			}
			
			return false;
		},
		
		/** Takes an array of notes and returns them in an object wrapper */
		notesToMap: function(notesArr, includeEnharmonics){
			var result = {};
			
			for( var i in notesArr ){
				result[notesArr[i].simple()] = notesArr[i];
				
				if( includeEnharmonics ){
					var eh = notesArr[i].enharmonics();
					
					for( var j in eh ){
						result[eh[j].simple()] = notesArr[i];
					}
				}
			}
			
			return result;
		},
		
		/** Returns true if the note or its enharmonic is a chord tone */
		isChordTone: function(note, chord){
			var notes = chord.notes();
			
			for( var i in notes ){
				if( isEnharmonic(notes[i], note) )
					return true;
			}
			
			return false;
		}
	}
}

