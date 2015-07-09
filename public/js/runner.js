
"use strict";

//Set the window to the top so the page will load correctly (for refreshing)
window.onbeforeunload = function () {
	window.scrollTo(0, 0);
};



//Starts the program
(function () {
	//Sad little function to fix safari webgl rendering issue
	var browserDetection = function () {
		if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
			return;
		} else if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
			return;
		} else if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
			return;
		} else if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
			return;
		} else if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
			document.getElementById("cubeCanvas").style.borderRadius = "0px";
		}
	};
	browserDetection();
	var operator = new Operator();
}());
