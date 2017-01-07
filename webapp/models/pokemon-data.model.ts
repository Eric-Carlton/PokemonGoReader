export class PokemonData {
	constructor(
		public Id : number,
		public Name: string,
		public BaseStamina: number,
		public BaseAttack : number,
		public BaseDefense : number,
		public Type1: string,
		public Type2: string,
		public QuickMoves: number[],
		public CinematicMoves: number[],
		public OldQuickMoves: number[],
		public OldCinematicMoves: number[],
		public CandyToEvolve: number,
		public FamilyId: number
	){ }
}
