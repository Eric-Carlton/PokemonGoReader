"use strict";

class Credential {
	constructor(
		login_type,
		token,
		username,
		password
	)
	{
		this.login_type = login_type.toLowerCase();
		this.token = token;
		this.username = username;
		this.password = password;
	}
}

module.exports = Credential;
