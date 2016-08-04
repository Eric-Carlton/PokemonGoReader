import { Coordinates } from './coordinates.model'

export class UserLogin {
	constructor(
		public username : string,
		public password : string,
		public type : string,
		public coords: Coordinates
	){ }
}