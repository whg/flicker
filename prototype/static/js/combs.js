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

var parts = [];
for (var i = 1, l = 6; i <= l; i++) {
	var selector = "svg " + (i < 3 ? "circle" : "path") + "[inkscapelabel='_" + i + "']";
	var e = document.querySelector(selector);
	parts.push(e);
}
var base = $(".logo");
var counter = 0;
var lastLength = 0;
combs.forEach(function(e, i) {
  var c = base.clone();
  c.find("span").text(i + 1);
  var on = combs[i];

  on.forEach(function(j) {
    $(c).find("[inkscapelabel=_" + j + "]")[0].style.stroke = "#fff";
  });

  if (on.length > lastLength) {
    $("#container").append("<br>");
  }
  lastLength =on.length;
  $("#container").append(c);
});



// setInterval(function () {
//   var bits = combs[counter];
//   parts.forEach(function(e) { e.style.stroke = "#000"; });
//   bits.forEach(function(e) {
//     parts[e-1].style.stroke = "#fff";
//   });
//   console.log(bits);
//   counter = (counter + 1) % combs.length;
// }, 500);
