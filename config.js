var config = {
	db: {
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'root123',
		database: 'chatbox'
	},
	jwtSecret: 'chatBox!@#$%',
	refreshJwtSecret: 'hovner!@#$%',
	versions: {
		v1: '/api/v1'
	}
}

module.exports = config;