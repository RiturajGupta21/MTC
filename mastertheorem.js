var app = new function () {
	var recurrence = new Elem("recurrence");
	var tc = new Elem("tc");
	this.calculate = function () {
		MathJax.Hub.Config({ showProcessingMessages: false });
		// Input
		var ain = document.getElementById("a").value;
		var bin = document.getElementById("b").value;
		var kin = document.getElementById("k").value;
		var iin = document.getElementById("i").value;
		if (ain == "" || bin == "" || kin == "" || iin == "")
			return;
		// Convert and render
		var a = parseFloat(ain);
		var b = parseFloat(bin);
		var k = parseFloat(kin);
		var i = parseFloat(iin);
		var text = "Error: ";
		if (isNaN(a))
			text += "Invalid value of \\(a\\)";
		else if (isNaN(b))
			text += "Invalid value of \\(b\\)";
		else if (isNaN(k))
			text += "Invalid value of \\(k\\)";
		else if (isNaN(i))
			text += "Invalid value of \\(i\\)";
		else if (a < 0)
			text += "\\(a\\) should be non-negative";
		else if (b <= 1)
			text += "\\(b\\) should be greater than 1";
		else if (k < 0)
			text += "\\(k\\) should be at least 0";
		else if (i < 0)
			text += "\\(i\\) should be at least 0";
		else
			text = "\\(T(n) \\: = \\: " + (a != 1 ? a : "") + " \\: T(n" + (b != 1 ? " / " + b : "") + ") \\, + \\, \u0398(" + formatPolyLog(k, i) + ").\\)";
		recurrence.render(text);
		if (text.substring(0, 6) == "Error:") {
			tc.render("");
			return;
		}
		var p = Math.log(a) / Math.log(b);
		var ans = "\\(T \\: \u2208 \\: \u0398(";
		if (resequal(p, k))
			ans += formatPolyLog(k, i + 1);
		else if (p < k)
			ans += formatPolyLog(k, i);
		else if (p > k) {
			if (resequal(Math.round(p), p))
				ans += formatPolyLog(Math.round(p), 0);
			else
				ans += formatPolyLog("\\log_{" + b + "} " + a, 0) + ") \\approx \u0398(" + formatPolyLog(p.toFixed(3), 0);
		} else
			ans = null;
		if (ans !== null)
			ans += ").\\)";
		else
			ans = "Arithmetic error";
		tc.render(ans);
	};
	// Constructor Class
	function Elem(id) {
		var container = document.getElementById(id);
		var newText = null;
		this.render = function (text) {
			var start = newText === null;
			newText = text;
			if (start)
				update();
		};
		function update() {
			var text = newText;
			var preSpanval = container.querySelector("span");
			var newSpanval = document.createElement("span");
			newSpanval.textContent = text;
			newSpanval.style.display = "none";
			container.appendChild(newSpanval);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, newSpanval]);
			MathJax.Hub.Queue(function () {
				if (preSpanval.parentNode !== null)
					container.removeChild(preSpanval);
				newSpanval.style.removeProperty("display");
				if (newText === text || newText === null)
					newText = null;
				else
					update();
			});
		};
		this.clear = function () {
			newText = null;
			while (container.firstChild !== null)
				container.removeChild(container.firstChild);
			container.appendChild(document.createElement("span"));
		};
	}
	// Returns (n^k log^i n).
	function formatPolyLog(k, i) {
		// Solving n^k
		var ans = null;
		if (typeof k == "number") {
			if (k == 0 && i != 0)
				ans = "";
			else if (k == 0 && i == 0)
				ans = "1";
			else if (k == 0.5)
				ans = "\\sqrt{n}";
			else if (k == 1)
				ans = "n";
			else
				k = k.toString();
		}
		if (ans !== null);
		else if (typeof k == "string")
			ans = "n^{" + k + "}";
		else
			throw "Invalid argument";
		// Solving log^i n
		if (i != 0) {
			if (ans != "")
				ans += " ";
			ans += "\\log";
			if (i != 1)
				ans += "^{" + i + "}";
			ans += " n";
		}
		return ans;
	}
	this.value = function (a, b, k, i) {
		document.getElementById("a").value = a + "";
		document.getElementById("b").value = b + "";
		document.getElementById("k").value = k + "";
		document.getElementById("i").value = i + "";
		this.calculate();
	};
	function resequal(x, y) {
		return Math.abs(x - y) < 1e-9;
	}
	this.cleanOutput = function () {
		recurrence.clear();
		tc.clear();
	};
};