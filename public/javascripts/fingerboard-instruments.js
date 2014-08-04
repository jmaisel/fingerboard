/**
 * Provided set of instruments and tunings
 */
guitharmony.Instruments = new function(){
	
	var that = {
		guitar: {
			strings: 6,
			frets: 22,
			tunings:{
				STANDARD:['e1', 'a1', 'd2', 'g2', 'b2', 'e3'],
				DADGAD:  ['d1', 'a1', 'd2', 'g2', 'a2', 'd3']
			}
		},
		
		bass: {
			strings: 4,
			frets: 22,
			tunings:{
				STANDARD: ['e0', 'a0', 'd0', 'g0']
			}
		}
	};
	
	return that;
};