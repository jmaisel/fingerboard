$(document).ready(function(){
	
	console.log("booting");
	
	var fb = new guitharmony.Fingerboard({
		instrument: guitharmony.Instruments.guitar,
//		tuning: "DADGAD",
		width: 350,
		height: 350,
		strings: 6,
		frets: 6,
		x : 55,
		y: 55,
		rounding: 10,
		el: "#svg"
	});
	
	$("#chord-input").on("change", function(){
		
		if( this.value ){
			var notes = teoria.chord(this.value).notes();
			var markers = fb.markAll(notes);
		}
		
		//var markers = fb.chord(notes, true);
		fb.view.displayMarkers(markers);
	});
	
	$("#clear").on("click", function(){
		fb.view.clearMarkers();
	});
	
	fb.view.drawDiagram();
});