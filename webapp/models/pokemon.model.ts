export class Pokemon {
	constructor(
		public pokedex_num : number,
		public name: string,
		public attack_iv : number,
		public defense_iv : number,
		public stamina_iv : number,
		public iv_percentage: number,
		public cp: number,
		public favorite: boolean,
		public candy: number
	){ }
}