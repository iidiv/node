let
	getEnv = null,
	print = null;

getEnv = function() {
	try {
		if(self && self.self === self) {
			getEnv = x => true;
		} else {
			getEnv = x => false;
		}
	} catch(e) {
		getEnv = x => false;
	}
	return getEnv();
};

print = function (params, color) {
	if(getEnv()) {
		// window下
		color = color || '#0089ff';
		if(params && typeof params === 'object') {
			console.table(params);
		} else {
			console.log('%c' + params, `
				font-size: 16px;
				color: white;
				background-color: ${ color }
			`);
		}
	} else {
		// node下
		color = `[${ color || '92' }m`;
		if(params && typeof params === 'object') {
			console.log(params);
		} else {
			console.log('\033' + color + params + ' \033[39m');
		}
	}
};

module.exports = {
	getEnv,
	print
};