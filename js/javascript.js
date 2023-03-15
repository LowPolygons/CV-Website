function random(min, max) {
	return Math.floor(Math.random()*(max-min) + min);
}

function determineColourIncrement(colour, increment) {
	let addition = colour+increment;
	if (addition > 255){
		addition = colour - increment;
	};
	return addition;
}

function RGBtoHex(R,G,B) {
	const vals = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
	var R2 = R % 16;
	var R1 = (R-R2) / 16; // 16
	var G2 = G % 16;
	var G1 = (G-G2) / 16; // 16
	var B2 = B % 16;
	var B1 = (B-B2) / 16; // 16
	
	let returnstring = "#"; 
	var output = returnstring.concat(vals[R1],vals[R2],vals[G1],vals[G2],vals[B1],vals[B2])
	return output;
}



function shuffleStyle() {
	//var min = 0;
	//var max = 15;
	//var randomImageNum = random(min, max);
	//var printval = ""

	//let hexcode = printval.concat("#",vals[random(min,max)],vals[random(min,max)],vals[random(min,max)],vals[random(min,max)],vals[random(min,max)],vals[random(min,max)]);
	const backgroundColourRGB = [random(0,255),random(0,255),random(0,255)];
	const colourIncrement = 65;
	const textColour = [ 255-backgroundColourRGB[0],255-backgroundColourRGB[1],255-backgroundColourRGB[2] ];
	const boxHighlights = [ determineColourIncrement(backgroundColourRGB[0], colourIncrement),determineColourIncrement(backgroundColourRGB[1], colourIncrement),determineColourIncrement(backgroundColourRGB[2], colourIncrement)];
	const hexBackgroundColour = RGBtoHex(backgroundColourRGB[0],backgroundColourRGB[1],backgroundColourRGB[2]);
	const hexTextColour = RGBtoHex(textColour[0], textColour[1], textColour[2]);
	const hexBoxHighlights = RGBtoHex(boxHighlights[0],boxHighlights[1], boxHighlights[2]);
		
	document.getElementById("main-body").style.background = hexBackgroundColour;

	document.getElementById("main-left").style.background = hexBoxHighlights;
	document.getElementById("main-left").style.color = hexTextColour;

	document.getElementById("main-right").style.background = hexBoxHighlights;
	document.getElementById("main-right").style.color = hexTextColour;
}
//<div class = "testbox" onmouseover="changeImage()"></div>