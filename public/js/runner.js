//Set the window to the top so the page will load correctly (for refreshing)
window.onbeforeunload = function () { 
	window.scrollTo(0,0); 
};
//Starts the program
(function () {
	var operator = new Operator();
})();
