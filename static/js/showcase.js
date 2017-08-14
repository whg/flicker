$("body").css({ "background-color" : $(".logo").css("background-color") });
$(".logo").css({ "margin": "0 auto" });

var parts = [];
for (var i = 1, l = 6; i <= l; i++) {
	var selector = "svg " + (i < 3 ? "circle" : "path") + "[inkscapelabel='_" + i + "']";
	var e = document.querySelector(selector);
	parts.push(e);
}

parts.forEach(function(e, i) {
	e.style.stroke = "#000";
	e.state = false;
});

var combs = [[1],
 [2],
 [3],
 [4],
 [5],
 [6],
 [1, 2],
 [1, 3],
 [1, 4],
 [1, 5],
 [1, 6],
 [2, 3],
 [2, 4],
 [2, 5],
 [2, 6],
 [3, 4],
 [3, 5],
 [3, 6],
 [4, 5],
 [4, 6],
 [5, 6],
 [1, 2, 3],
 [1, 2, 4],
 [1, 2, 5],
 [1, 2, 6],
 [1, 3, 4],
 [1, 3, 5],
 [1, 3, 6],
 [1, 4, 5],
 [1, 4, 6],
 [1, 5, 6],
 [2, 3, 4],
 [2, 3, 5],
 [2, 3, 6],
 [2, 4, 5],
 [2, 4, 6],
 [2, 5, 6],
 [3, 4, 5],
 [3, 4, 6],
 [3, 5, 6],
 [4, 5, 6],
 [1, 2, 3, 4],
 [1, 2, 3, 5],
 [1, 2, 3, 6],
 [1, 2, 4, 5],
 [1, 2, 4, 6],
 [1, 2, 5, 6],
 [1, 3, 4, 5],
 [1, 3, 4, 6],
 [1, 3, 5, 6],
 [1, 4, 5, 6],
 [2, 3, 4, 5],
 [2, 3, 4, 6],
 [2, 3, 5, 6],
 [2, 4, 5, 6],
 [3, 4, 5, 6],
 [1, 2, 3, 4, 5],
 [1, 2, 3, 4, 6],
 [1, 2, 3, 5, 6],
 [1, 2, 4, 5, 6],
 [1, 3, 4, 5, 6],
 [2, 3, 4, 5, 6],
 [1, 2, 3, 4, 5, 6]];

var frameCounter = 0;
var onTime = 1000;
function update() {
		var currentPair = pairs[frameCounter];

		parts.forEach(function(e, i) {
			e.style.stroke = "#000";
		});
		var on = combs[parseInt(currentPair["perm"]) - 1];
		if (on) {
  		on.forEach(function(j) {
    		parts[j - 1].style.stroke = "#ccf";
  		});
		}

		frameCounter = (frameCounter + 1) % pairs.length;

		setTimeout(update, onTime * currentPair["time"]);

}

update();
