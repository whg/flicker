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

//
//
// // var lastIndex = 0;
// // setInterval(function() {
// // 	var nextIndex = lastIndex;
// // 	do {
// // 		nextIndex = Math.floor(Math.random() * parts.length);
// // 	} while (lastIndex == nextIndex);
//
// // 	var p = parts[nextIndex];
// // 	p.style.stroke = p.state ? "#000" : "#fff";
// // 	p.state = !p.state;
// // 	lastIndex = nextIndex;
// // }, 200);
//
// var currentThing = null;
//
var onTime = 1000;
document.querySelector('div.speed input').oninput = function() {
	document.querySelector('div.speed span').innerHTML = this.value;
	onTime = parseFloat(this.value) * 1000;
};
//
// document.querySelector('div.keep-on input').oninput = function() {
// 	document.querySelector('div.keep-on span').innerHTML = this.value;
//
// };
//
// function Random() {
//
// 	this.alive = true;
// 	var lastIndex = 0;
// 	var that = this;
// 	var loopInterval = 200;
//
// 	this.iterate = function() {
// 		var nextIndex = lastIndex;
// 		do {
// 			nextIndex = Math.floor(Math.random() * parts.length);
// 		} while (lastIndex == nextIndex);
//
// 		var p = parts[nextIndex];
// 		p.style.stroke = p.state ? "#000" : "#fff";
// 		p.state = !p.state;
// 		lastIndex = nextIndex;
// 	};
//
// 	this.loop = function() {
// 		if (that.alive) {
// 			that.iterate();
// 			setTimeout(that.loop, loopInterval);
// 		}
// 	};
//
// 	this.setLoopInterval = function(i) {
// 		loopInterval = i;
// 	};
// }
//
// var random = new Random();
// random.loop(200);
// currentThing = random;

var dots = $(".dot").toArray();
var lastDot = null;
function getPair() {
	return {
		pattern: $(this).find("input[name=pattern]"),
		duration: $(this).find("input[name=duration]")
	};
}

var pairs = $("#steps tbody tr").map(getPair);

var frameCounter = 0;
var interval = 500;
function update() {
	var currentPair = pairs[frameCounter];
	var pattern = currentPair.pattern.val();
	if (pattern === "") {
		frameCounter = 0;
		currentPair = pairs[frameCounter];
		pattern = currentPair.pattern.val();
	}

	if (pattern !== "") {
		var duration = currentPair.duration.val();
		if (duration == "") {
			duration = 1;
			currentPair.duration.val(duration);
		} else {
			duration = parseFloat(duration);
		}

		if (lastDot !== null) {
			$(lastDot).toggleClass("on");
		}
		var dot = $(dots[frameCounter]);
		dot.toggleClass("on");
		lastDot = dot;

		parts.forEach(function(e, i) {
			e.style.stroke = "#000";
		});
		var on = combs[parseInt(pattern) - 1];
		if (on) {
  		on.forEach(function(j) {
    		parts[j - 1].style.stroke = "#ccf";
  		});
		}

		frameCounter = (frameCounter + 1) % pairs.length;

		setTimeout(update, onTime * duration);
	} else {
		setTimeout(update, onTime);
	}


}

update();

$.get("/saved", function(data) {
	var patterns = JSON.parse(data);
	console.log(patterns);
	patterns.forEach(function(e, i) {
		$('select').append($('<option>', {
			text: e.name,
			value: JSON.stringify(e.sequence)
		}));
	});
});

$("select").change(function() {
	var sequence = JSON.parse($(this).val());
	pairs.each(function(i, e) {
		var p = sequence[i] ? sequence[i].perm : "";
		var time = sequence[i] ? sequence[i].time : "";
		e.pattern.val(p);
		e.duration.val(time);
	});
});


$("button[name=save]").click(function() {

	var name = prompt("Sequence name");
	if ( name !== null && name !== "") {

		var result = [];
		for (var i = 0, l = pairs.length; i < l; i++) {
			if (pairs[i].pattern.val() === "") {
				break;
			}
			result.push({
				perm: pairs[i].pattern.val(),
				time: pairs[i].duration.val()
			});
		}

		var patterns = {
			name: name,
			sequence: result,
			time: $("input[type=range]").val()
		};

		$.post('/save', { "patterns": JSON.stringify(patterns) } ); //

		$('select').append($('<option>', {
			text: name,
			value: JSON.stringify(result)
		}));
	}
});
