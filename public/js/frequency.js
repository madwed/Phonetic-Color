(function(){

Operator.prototype.tally = function (string) {
	var count = {}, letter;
	for(var i = 0; i < string.length; i++){
		letter = string[i];
		if(!count[letter]){
			count[letter] = 1;
		}else{
			count[letter] += 1;
		}
	}
	var phonemes = Object.keys(count);
	var frequency = [], phone;
	for(var neme = 0; neme < phonemes.length; neme++){
		phone = phonemes[neme];
		if(phone === "J"){
			continue;
		}
		frequency[neme] = [this.customCode[phone].phoneme,count[phone]];
	}
	frequency.sort(function(a,b){
		return a[1] > b[1] ? -1 : 1;
	})
	console.log(frequency.join(" "));
};

})();