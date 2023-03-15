function random(min, max) {
	return Math.floor(Math.random()*(max-min) + min);
}


function changeImage() {
	const vals = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]
	var min = 0;
	var max = 15;
	var randomImageNum = random(min, max);
	var printval = ""

	let hexcode = printval.concat("#",vals[random(min,max)],vals[random(min,max)],vals[random(min,max)],vals[random(min,max)],vals[random(min,max)],vals[random(min,max)]);
  //var img = document.getElementById("main-titles");
  //document.getElementById("main-photo").style.backgroundImage = img.Image;
  document.getElementById("main-left").style.background = hexcode;
}