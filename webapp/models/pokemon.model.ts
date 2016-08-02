export class Pokemon {
	constructor(
		public name : string,
		public pokedexNum: number,
		public attackIv : number,
		public defenseIv : number,
		public staminaIv : number,
		public ivPercentage: number,
		public cp: number
	){ }
}