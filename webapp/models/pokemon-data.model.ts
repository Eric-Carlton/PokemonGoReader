export class PokemonData {
	constructor(
		public ID : number,
		public Name: string,
		public BaseStamina: number,
		public BaseAttack : number,
		public BaseDefense : number,
		public Type1: string,
		public Type2: string,
		public QuickMoves: number[],
		public CinematicMoves: number[],
		public CandyToEvolve: number
	){ }
}
