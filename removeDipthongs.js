//create a phoneme dictionary with vowels instead of dipthongs
function removeDipts(){
	var phoneDictStream = fs.createReadStream('./cmudict/cmudict.0.7a_SPHINX_40.txt','utf8')
		.pipe(split());
	var noDipt = fs.createWriteStream('./cmudict/finalDict.txt', 'utf8');
	var num = 0;
	phoneDictStream.on('data', function(line){
		var entry = line.split(/\s/);
		var phonemes = [entry[0]];
		var currentEntry = entry.splice(1,entry.length);
		for(var i = 0; i < currentEntry.length; i++){

		}

	}).pipe(noDipt);
	phoneDictStream.on('error',function(err){
		return console.log(err);
	});
	phoneDictStream.on('end',function(){
		console.log("completed");
	});
}

AW
AY
ER
EY
OW
OY
SIL
