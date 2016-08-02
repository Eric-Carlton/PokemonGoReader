import { Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { UserLogin } from '../models/user-login.model'
import { Pokemon } from '../models/pokemon.model';


@Injectable()
export class PokemonService {
	pokemon : Pokemon[] = [];
	@Output() pokemonChange: EventEmitter<any> = new EventEmitter();

	private _pokemonUrl = 'http://localhost:8008/api/pokemon/get';
	private _pokemonNamesByDexNum = {
		'0':'MissingNo',
		'1':'Bulbasaur',
		'2':'Ivysaur',
		'3':'Venusaur',
		'4':'Charmander',
		'5':'Charmeleon',
		'6':'Charizard',
		'7':'Squirtle',
		'8':'Wartortle',
		'9':'Blastoise',
		'10':'Caterpie',
		'11':'Metapod',
		'12':'Butterfree',
		'13':'Weedle',
		'14':'Kakuna',
		'15':'Beedrill',
		'16':'Pidgey',
		'17':'Pidgeotto',
		'18':'Pidgeot',
		'19':'Rattata',
		'20':'Raticate',
		'21':'Spearow',
		'22':'Fearow',
		'23':'Ekans',
		'24':'Arbok',
		'25':'Pikachu',
		'26':'Raichu',
		'27':'Sandshrew',
		'28':'Sandslash',
		'29':'Nidoran♀',
		'30':'Nidorina',
		'31':'Nidoqueen',
		'32':'Nidoran♂',
		'33':'Nidorino',
		'34':'Nidoking',
		'35':'Clefairy',
		'36':'Clefable',
		'37':'Vulpix',
		'38':'Ninetales',
		'39':'Jigglypuff',
		'40':'Wigglytuff',
		'41':'Zubat',
		'42':'Golbat',
		'43':'Oddish',
		'44':'Gloom',
		'45':'Vileplume',
		'46':'Paras',
		'47':'Parasect',
		'48':'Venonat',
		'49':'Venomoth',
		'50':'Diglett',
		'51':'Dugtrio',
		'52':'Meowth',
		'53':'Persian',
		'54':'Psyduck',
		'55':'Golduck',
		'56':'Mankey',
		'57':'Primeape',
		'58':'Growlithe',
		'59':'Arcanine',
		'60':'Poliwag',
		'61':'Poliwhirl',
		'62':'Poliwrath',
		'63':'Abra',
		'64':'Kadabra',
		'65':'Alakazam',
		'66':'Machop',
		'67':'Machoke',
		'68':'Machamp',
		'69':'Bellsprout',
		'70':'Weepinbell',
		'71':'Victreebel',
		'72':'Tentacool',
		'73':'Tentacruel',
		'74':'Geodude',
		'75':'Graveler',
		'76':'Golem',
		'77':'Ponyta',
		'78':'Rapidash',
		'79':'Slowpoke',
		'80':'Slowbro',
		'81':'Magnemite',
		'82':'Magneton',
		'83':'Farfetch\'d',
		'84':'Doduo',
		'85':'Dodrio',
		'86':'Seel',
		'87':'Dewgong',
		'88':'Grimer',
		'89':'Muk',
		'90':'Shellder',
		'91':'Cloyster',
		'92':'Gastly',
		'93':'Haunter',
		'94':'Gengar',
		'95':'Onix',
		'96':'Drowzee',
		'97':'Hypno',
		'98':'Krabby',
		'99':'Kingler',
		'100':'Voltorb',
		'101':'Electrode',
		'102':'Exeggcute',
		'103':'Exeggutor',
		'104':'Cubone',
		'105':'Marowak',
		'106':'Hitmonlee',
		'107':'Hitmonchan',
		'108':'Lickitung',
		'109':'Koffing',
		'110':'Weezing',
		'111':'Rhyhorn',
		'112':'Rhydon',
		'113':'Chansey',
		'114':'Tangela',
		'115':'Kangaskhan',
		'116':'Horsea',
		'117':'Seadra',
		'118':'Goldeen',
		'119':'Seaking',
		'120':'Staryu',
		'121':'Starmie',
		'122':'Mr.',
		'123':'Scyther',
		'124':'Jynx',
		'125':'Electabuzz',
		'126':'Magmar',
		'127':'Pinsir',
		'128':'Tauros',
		'129':'Magikarp',
		'130':'Gyarados',
		'131':'Lapras',
		'132':'Ditto',
		'133':'Eevee',
		'134':'Vaporeon',
		'135':'Jolteon',
		'136':'Flareon',
		'137':'Porygon',
		'138':'Omanyte',
		'139':'Omastar',
		'140':'Kabuto',
		'141':'Kabutops',
		'142':'Aerodactyl',
		'143':'Snorlax',
		'144':'Articuno',
		'145':'Zapdos',
		'146':'Moltres',
		'147':'Dratini',
		'148':'Dragonair',
		'149':'Dragonite',
		'150':'Mewtwo',
		'151':'Mew'
	};

	constructor(private http: Http) { }

	retrievePokemon (login: UserLogin) {
		let headers = new Headers({
			'Content-Type': 'application/json'});
		return this.http
		.post(this._pokemonUrl, JSON.stringify(login), {headers: headers})
		.toPromise()
		.then(res => {
			let pkmnArr: Pokemon[] = [];
			let rawPkmn = res.json().pokemon;

			for(let i: number = 0; i < rawPkmn.length; i++){
				let pkmn = rawPkmn[i];

				if(pkmn.hasOwnProperty('is_egg') && !pkmn.is_egg){
					let name = this._pokemonNamesByDexNum[pkmn.pokemon_id.toString()];
					if(pkmn.hasOwnProperty('nickname') && pkmn.nickname.length > 0){
						name = pkmn.nickname;
					}

					pkmnArr.push(new Pokemon(
						name, 
						pkmn.pokemon_id,
						pkmn.individual_attack,
						pkmn.individual_defense,
						pkmn.individual_stamina,
						parseFloat(((pkmn.individual_attack + pkmn.individual_defense + pkmn.individual_stamina) / 45 * 100).toFixed(2)),
						pkmn.cp
						));
				}
			}

			this.pokemon = pkmnArr.sort((a, b) => {
				let aDexNum = a.pokedexNum;
				let bDexNum = b.pokedexNum;

				if(aDexNum < bDexNum) return -1;
    			if(aDexNum > bDexNum) return 1;
    			return 0;
			});

			this.pokemonChange.emit('pokemon changed');
		})
		.catch(this.handleError);
	}

	private handleError(error: any) {
		console.error('An error occurred', error);
		return Promise.reject(error.message || error);
	}
}