import { SortType } from '../models/sort-type.model'
import { SortOrder } from '../models/sort-order.model'
import { PokemonTableStat } from '../models/pokemon-table-stat.model'

export class PropertiesService {
	public apiHost: string = '//' + window.location.hostname + ':8008';
	public getPokemonRoute: string = '/api/pokemon/get';
	public transferPokemonRoute: string = '/api/pokemon/transfer';
	public renamePokemonRoute: string = '/api/pokemon/rename';

	public loginComponentTitle: string = 'Pokemon Go! Pokemon Retriever';
	public loginComponentContent: string = 'Why use an IV calculator when you can easily retrieve your Pokemon\'s exact data from Niantic? This easy-to-use tool allows you to do just that!';
	public loginErrorMessage: string = 'Unable to login';

	public pokemonStatsComponentTitle: string = 'Pokemon Stats';
	public pokemonStatsComponentContent: string = 'Click a sort order to sort by that property. Default sort is Pokedex number, secondarily sorting by IV percentage where Pokedex number is the same, and finally sorting by CP where Pokedex number and IV percentage are the same.';

	public useTabularFormat: boolean = false;

	public showTransferButton: boolean = true;
	public showRenameButton: boolean = true;

	public pokemonTableStats: PokemonTableStat[] = [
		new PokemonTableStat('level', 'Level'),
		new PokemonTableStat('name', 'Name'),
		new PokemonTableStat('species', 'Species'),
		new PokemonTableStat('pokedex_number', 'Pokedex Number'),
		new PokemonTableStat('cp', 'CP'),
		new PokemonTableStat('max_hp', 'Max HP'),
		new PokemonTableStat('attack_iv', 'Attack IV'),
		new PokemonTableStat('defense_iv', 'Defense IV'),
		new PokemonTableStat('stamina_iv', 'Stamina IV'),
		new PokemonTableStat('iv_percentage', 'IV Percent'),
		new PokemonTableStat('favorite', 'Favorite'),
		new PokemonTableStat('caught_time', 'Caught Time')
	];

	public defaultPokemonTableSortOrder: string = 'pokedex_number';
	public pokemonTableSortOrders: any = {
		level: new SortOrder(
			'Level', [
			new SortType('level', false),
			new SortType('pokedex_number', true),
			new SortType('iv_percentage', false),
			new SortType('cp', false)]
		),

		name: new SortOrder(
			'Name', [
			new SortType('name', true),
			new SortType('iv_percentage', false),
			new SortType('cp', false)]
		),

		species: new SortOrder(
			'Species', [
			new SortType('species', true),
			new SortType('iv_percentage', false),
			new SortType('cp', false)]
		),

		pokedex_number: new SortOrder(
			'Pokedex Number', [
			new SortType('pokedex_number', true),
			new SortType('iv_percentage', false),
			new SortType('cp', false)]
		),

		candy: new SortOrder(
			'Candy', [
			new SortType('candy', false),
			new SortType('pokedex_number', true),
			new SortType('cp', false),
			new SortType('iv_percentage', false)]
		),

		cp: new SortOrder(
			'CP', [
			new SortType('cp', false),
			new SortType('iv_percentage', false),
			new SortType('pokedex_number', true)]
		),

		evolve: new SortOrder(
			'Evolutions', [
			new SortType('evolve_sort', false),
			new SortType('pokedex_number', true),
			new SortType('iv_percentage', false)]
		),

		max_hp: new SortOrder(
			'Max HP', [
			new SortType('max_hp', false),
			new SortType('iv_percentage', false),
			new SortType('pokedex_number', true)]
		),

		attack_iv: new SortOrder(
			'Attack IV', [
			new SortType('attack_iv', false),
			new SortType('iv_percentage', false),
			new SortType('pokedex_number', true)]
		),

		defense_iv: new SortOrder(
			'Defense IV', [
			new SortType('defense_iv', false),
			new SortType('iv_percentage', false),
			new SortType('stamina_iv', false),
			new SortType('pokedex_number', true)]
		),

		stamina_iv: new SortOrder(
			'Stamina IV', [
			new SortType('stamina_iv', false),
			new SortType('iv_percentage', false),
			new SortType('defense_iv', false),
			new SortType('pokedex_number', true)]
		),

		iv_percentage: new SortOrder(
			'IV Percent', [
			new SortType('iv_percentage', false),
			new SortType('cp', false)]
		),

		favorite: new SortOrder(
			'Favorite', [
			new SortType('favorite', false),
			new SortType('iv_percentage', false),
			new SortType('pokedex_number', true)]
		),

		caught_time: new SortOrder('Caught Time', [new SortType('caught_time', false)])
	};
}
