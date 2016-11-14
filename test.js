// phoneNumberDetails.phoneNumberRegion=DOMESTIC&phoneNumberDetails.phoneNumber=
var string = 'phoneNumberDetails.phoneNumberRegion=DOMESTIC&phoneNumberDetails.phoneNumber=';

var buf = '';
var model = [];
var attr = [];
var value = [];

var symtab = {
	'.': model,
	'=': attr,
	'&': value
};

// TODO: Do that in one pass
for(var iter = 0, len = string.length; iter < len; iter+=1) {
	var char = string[iter];
	var target = symtab[char];
	if (target) {
		target.push(buf);
		buf = '';
	} else {
		buf += char;
	}
}

var list = [];

for (iter = 0, len = model.length; iter < len; iter +=1 ) {
	list.push({
		model: model[iter],
		attr: attr[iter],
		value: value[iter] || ''
	});
}

console.log(list);