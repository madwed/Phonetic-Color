var fs = require("fs");
var split = require("split");

//create a phoneme dictionary with vowels instead of dipthongs
function removeDipts(){
	var phoneDictStream = fs.createReadStream('./cmudict/cmudict.0.7a_SPHINX_40.txt','utf8')
		.pipe(split());
	var noDipt = fs.createWriteStream('./cmudict/finalDict.txt', 'utf8');
	var num = 0;
	phoneDictStream.on('data', function(line){
		var lineInput = line.split(/\s/);
		var lineOutput = [lineInput[0]];
		var ditpIn = lineInput.splice(1,lineInput.length);
		for(var i = 0; i < ditpIn.length; i++){
			var phoneme = ditpIn[i];
			switch(phoneme){
				case("AW"):
					lineOutput.push("AA", "UH");
					break;
				case("AY"):
					lineOutput.push("AA", "IH");
					break;
				case("ER"):
					lineOutput.push("EH", "R");
					break;
				case("EY"):
					lineOutput.push("e", "IH");
					break;
				case("OW"):
					lineOutput.push("o", "UH");
					break;
				case("OY"):
					lineOutput.push("AO", "IH");
					break;
				default:
					lineOutput.push(phoneme);
			}
		}

		noDipt.write(lineOutput.join(" ") + "\n\r");

	});
	phoneDictStream.on('error',function(err){
		return console.log(err);
	});
	phoneDictStream.on('end',function(){
		console.log("completed");
	});
}

removeDipts();

/*
AW - AA UH
AY - AA IH
ER - EH R
EY - e IH
OW - o UH
OY - AO IH
*/