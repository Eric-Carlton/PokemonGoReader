export class PropertiesService {
	apiHost: string = 'http://192.168.0.12:8008';

	getPokemonRoute: string = '/api/pokemon/get';

	loginComponentTitle: string = 'Pokemon Go! Pokemon Retriever';
	logicComponentContent: string = 'Why use an IV calculator when you can easily retrieve your Pokemon\'s exact data from Niantic? This easy-to-use tool allows you to do just that!';

	pokemonTableComponentTitle: string = 'Pokemon Stats';
	pokemonTableComponentContent: string = 'Click a heading in the table to sort by that attribute. Default sort is Pokedex number, secondarily sorting by CP where Pokedex number is the same.';
}