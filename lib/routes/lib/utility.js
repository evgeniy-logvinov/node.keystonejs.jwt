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