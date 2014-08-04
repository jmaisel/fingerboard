/**
 * Represents a fingerboard on a stringed instrument. 
 */
guitharmony.Fingerboard = function(config){
	
	/* private members / functions */
	
	var ANIM_DUR = 400;
	
	// get the configured tuning
	var tuning = config.tuning || guitharmony.Instruments.guitar.tunings.STANDARD;
	
	// style attributes
	var style = config.gridStyle || {
		fill: "white",
		stroke: "black",
		strokeWidth: 1
	};
	
	// create a common reusable snap instance
	var snap = Snap(config.el);
	$(config.el).css("width", config.width + (config.width/config.strings)*2);
	$(config.el).css("height", config.height + (config.height/config.frets)*2);
	
	// wrapper function to ensure state 
	// is maintained in the state object
	var state;
	function updateState(newConfig, replace){
		
		if( newConfig )
			console.log("updateState(", newConfig, replace, ")");
		
		var initialState = {
			view:{
				snap: snap,
				//x: config.x || 20,
				//y: config.y || 20,
				x: config.width/config.strings,
				y: config.height/config.frets,
				width: config.width || 300,
				height: config.height || 300,
				rounding: config.rounding || 20,
				markers: [],
				style: style
			},
			
			fret: 0,
			frets: config.frets || 6,
			strings: config.strings || 6,
			tuning: config.tuning || guitharmony.Instruments.guitar.tunings.STANDARD,
		}
		
		if( !state )
			state = initialState;
		
		else if( replace )
			state = newConfig;
		
		else if( newConfig )
			$.extend(true, state, newConfig);
		
		if( newConfig || replace )
			console.log("updated state:", state);
		
		return state;
	}
	
	/** draws the inner lines on a graph **/
	function drawLines(points){
		var lines = [];
		
		for( var i=0; i<points.length; i++ ){
			var pt = points[i];
			var line = snap.line(pt.x1, pt.y1, pt.x2, pt.y2);
			
			if( i > 0 && i < points.length-1)
				line.attr(style);
			
			line.attr({opacity:0});
			line.animate({opacity:1}, ANIM_DUR*3);
			
			lines.push(line);
		}
		
		return lines;
	}
	
	/* public methods / properties */
	var that = {
			
		/** model and view state */
		state: updateState,
		
		/** functions specific to view state */
		view : {
			
			/** initialize the diagram */
			drawDiagram : function(){
				var vs = that.state().view;
				var box = snap.rect(vs.x, vs.y, vs.width, vs.height, vs.rounding, vs.rounding);
				box.attr(style);
				box.attr({opacity: 0});
				box.animate({opacity:1}, ANIM_DUR*6);
				
				vs.el = config.el;
				
				updateState({view: {
					box: box,
					strings: that.view.drawStrings(),
					frets: that.view.drawFrets()
				}});
			},
			
			/** Draw the strings */
			drawStrings : function(){
				var points = that.view.getAllStringPoints();
				return drawLines(points);
			},
			
			/** Draw the frets */
			drawFrets : function(){
				var points = that.view.getAllFretPoints();
				return drawLines(points);
			},
			
			/** Get the points for each string on the graph */
			getAllStringPoints : function(){
				var strings = that.state().strings;
				var result = [];
				
				for( var i=0; i<strings; i++ ){
					result.push(that.view.getStringPoints(i));
				}
				
				return result;
			},
			
			/** Get the points for a given string */
			getStringPoints : function(strnbr){
				var x = (config.width/(config.strings-1) * strnbr) + config.x;
				return{
					x1 : x, 
					y1 : config.y,
					x2: x,
					y2 : config.y + config.height
				}
			},
			
			/** Get the points for each fret on the graph */
			getAllFretPoints : function(){
				var frets = that.state().frets;
				var result = [];
				
				for( var i=0; i<frets; i++ ){
					result.push(that.view.getFretPoints(i));
				}
				
				return result;
			},
			
			/** Get the points for a given fret */
			getFretPoints : function(fretnbr){
				var y = (config.height/(config.frets-1) * fretnbr) + config.y;
				return{
					x1: config.x,
					y1 : y,
					x2: config.x + config.width,
					y2: y
				}
			},
			
			/** Get the distance between frets */
			getFretHeight : function(){
				var y1 = config.y;
				var y2 = (config.height/config.frets) + y1;
				return y2 - y1;
			},
			
			/** Get the distance between strings */
			getStringSpacing : function(){
				var x1 = config.x;
				var x2 = (config.width/config.strings) + x1;
				return x2 - x1;
			},
			
			/** Given string and fret number, calculates the center point between frets to display a marker */
			getMarkerPosition : function(str, frt){
				return{
					x: that.view.getStringPoints(str).x1,
					y: that.view.getFretPoints(frt).y1 - (that.view.getFretHeight()/2) - (that.view.getMarkerRadius()/4)
				}
			},
			
			/** Get the radius of a circular marker */
			getMarkerRadius : function(){
				return that.state().view.height / 20;
			},
			
			/** Reset the markers to the open position */
			resetMarkers : function(){
				
				var markers = that.state().view.markers || [];
				
				if( markers.length ){
					console.log("moving markers");
					
					for( var i=0; i<markers.length; i++ ){
						markers[i].animate({cy: 10}, 250);
					}
				}
			},
			
			/** Clear all the fret markers */
			clearMarkers : function(){
				snap.selectAll("circle").forEach(function(element){
					element.animate({opacity: 0, r: that.view.getMarkerRadius()+5}, ANIM_DUR*2);
					setTimeout(function(){element.remove();}, ANIM_DUR*2);
				});
				
				updateState({view:{markers:{}}});
			},
			/** Display markers on the given strings */
			displayMarkers: function(markers){
				
				if( !markers )
					return;
				
				var renderedMarkers = [];
				
				for( var i=0; i<that.state().strings; i++ ){
					var frets = markers[i];
					
					//*
					var lowest = 99;
					var lowestIdx = 0;
					
					for( var j=0; j<frets.length; j++ ){
						if( frets[j].fret > lowest )
							continue;
						
						lowest = frets[j].fret;
						lowestIdx = j;
					}
					
					var circle = that.state().view.markers[i];
					var pt = that.view.getMarkerPosition(i, frets[lowestIdx].fret);
					
					if(!circle){
						console.log( "drawing new marker");
						circle = snap.circle(pt.x, pt.y, that.view.getMarkerRadius()*2);
						circle.attr({opacity:0});
						renderedMarkers.push(circle);
					}
					
					circle.animate({cx:pt.x, cy:pt.y, opacity: 1, r:that.view.getMarkerRadius()}, ANIM_DUR);
				}
				
				if(renderedMarkers.length)
					updateState({view:{markers: renderedMarkers}});
			}
		}, // end view functions
		
		/** 
		 * Given a note and a string number, return the fret
		 * of that note or an enharmonic.  If the note
		 * can't be found in the current range of visible
		 * frets, returns -1.
		 */
		getFret: function(note, stringNbr){
			// get the open note
			var open = teoria.note.fromString(tuning[stringNbr]);
			
			for( var i=0; i<that.state().frets; i++ ){
				var fretted = teoria.note.fromKey(open.key() + i);
				
				if( guitharmony.TheoryUtil.isEnharmonic(note, fretted) ){
					return i;
				}
			}
			
			return -1;
		},
		
		/** Returns the note of an open string specified by stringNbr **/
		openString : function(stringNbr){
			return teoria.note.fromString(that.state().tuning[stringNbr]);
		},
		
		/** Returns the note on a given string at a given fret. */
		noteAt : function(stringNbr, fretNbr){
			return teoria.note.fromKey(that.openString(stringNbr).key() + fretNbr);
		},
		
		/** Returns an array of markers for any fret which which houses any of the notes */
		markString : function(strNbr, notes){
			
			var result = [];
			
			for( var i=0; i<notes.length; i++ ){
				var fret = that.getFret(notes[i], strNbr);
				
				if( fret == -1 )
					continue;
				
				var marker = new guitharmony.FingerboardMarker(strNbr, fret, that);
				result.push(marker);
			}
			
			return result;
		},
		
		/** Returns an array of markers for the notes on each string */
		markAll : function(notes){
			var result = [];
			
			for( var i=0; i<=that.state().strings-1; i++ ){
				result.push(that.markString(i, notes));
			}
			
			return result;
		},
		
		/**
		 * Given the present tuning and a chord
		 * supplied in <code>notes</code> returns 
		 * an array of FretMarkers representing
		 * the voicing of the chord.
		 */
		chord: function(notes, barre){
			var barre = barre || true;
			
			// get the tuning
			var tuning = that.state().tuning;
			
			if(!that.state().frets)
				that.view.resetMarkers();
			
			var tones = {};
			for( var i in notes ){
				var note = notes[i];
				var enharmonics = note.enharmonics();
				tones[note.simple()] = note;
			}
			
			console.log( "tones:", tones, "tuning:", tuning );
			
			// save the notes on each string, and the subsequent voicing
			var voicing = {strings:[], notes:{}};
			
			// lowest fret; used if barre = true
			var lowestFret = -1;
			
			// get the strings
			for( var i=0; i<tuning.length; i++){

				var open = teoria.note.fromString(tuning[i]);
				
				// for each fret
				for(var j=0; j<that.state().frets; j++ ){
					
					var fretted = teoria.note.fromKey(open.key() + j);
					
					if( tones[fretted.simple()] ){
						
						if( barre && (fretted < lowestFret) )
							continue;
						
						// mark the match
						var marker = new guitharmony.FingerboardMarker(i, j, that);
						
						// associate marker with string
						voicing.strings[i] = marker;
						
						// save the note in the voicing
						if( !voicing.notes[note.simple()] )
							voicing.notes[note.simple()] = [];
						
						voicing.notes[note.simple()].push(marker);
						
						// save the first match on the 6th string
						// for barre chords.
						if( lowestFret == -1 )
							lowestFret = fretted;
						
						break;
					}
				}
			}
			
			return voicing;
		},
		
		toString : function(){
			return "Fingerboard";
		}
	};
	
	return that;
}


