exports.getAccessToken = (req) => req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
exports.getRefreshToken = (req) => req.body.refreshToken || req.query.refreshToken || req.headers['x-refresh-token'] || req.headers.refreshToken;
exports.getClientInfo = (req) => {
	const userAgent = req.headers['user-agent'];
	const ip = req.headers['x-forwarded-for']
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || (req.connection.socket ? req.connection.socket.remoteAddress : null);

	return { userAgent, ip };
};
exports.checkEmail = (email) => {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};
exports.checkPhone = (phone) => {
	var re = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
	return re.test(String(phone).toLowerCase());
};
exports.checkName = (name) => {
	var re = /^[a-zA-Z ]+$/;
	return re.test(String(name).toLowerCase());
};
