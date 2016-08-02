module.exports = {
	log: {
		levels: {
			console: 'trace'
		},
		names: {
			index: 'server.index'
		}
	},
	server: {
		port: 8008,
		listeningMsg: 'Listening on port %s...'
	},
	cors: {
		allowOrigin: '*',
		allowHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
	},
	routes: {
		root: '/api',
		pokemon: '/pokemon/get'
	},
	coords: {
		lat: 35.8963192,
		lng: -78.8099471
	}, 
	errors: {
		username: 'username is required',
		password: 'password is required',
		type: 'type is required',
		inventory: 'Error occurred getting inventory',
		login: 'Error occurred logging in'
	}
}