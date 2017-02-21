import { Injectable } from '@angular/core';

import { PokemonTableStat } from '../models/pokemon-table-stat.model'

import { PropertiesService } from './properties.service'
import { UtilsService } from './utils.service'
import { PokemonService } from './pokemon.service'

@Injectable()
export class SettingsService {
	constructor(
		private _properties: PropertiesService,
		private _utils: UtilsService,
		private _pokemonService: PokemonService
	){ }

	public get displayByMonster(): boolean {
		return this.getUserSetting('displayByMonster');
	}

	public get useTabularFormat(): boolean {
		return this.getUserSetting('useTabularFormat');
	}

	public get showTransferButton(): boolean {
		return this.getUserSetting('showTransferButton');
	}

	public get showRenameButton(): boolean {
		return this.getUserSetting('showRenameButton');
	}

	public get showFavoriteButton(): boolean {
		return this.getUserSetting('showFavoriteButton');
	}

	public get pokemonTableStats(): PokemonTableStat[] {
		return this.getUserSetting('pokemonTableStats');
	}

	public set displayByMonster(displayByMonster: boolean) {
		this.saveUserSetting('displayByMonster', displayByMonster);
	}

	public set useTabularFormat(useTabularFormat: boolean) {
		this.saveUserSetting('useTabularFormat', useTabularFormat);
	}

	public set showTransferButton(showTransferButton: boolean) {
		this.saveUserSetting('showTransferButton', showTransferButton);
	}

	public set showRenameButton(showRenamButton: boolean) {
		this.saveUserSetting('showRenameButton', showRenamButton);
	}

	public set showFavoriteButton(showFavoriteButton: boolean) {
		this.saveUserSetting('showFavoriteButton', showFavoriteButton);
	}

	public createSettings(){
		this._utils.setLocalStorageObj('settings', {});
	}

	public createUserSettings() {
		let settings = this._utils.getLocalStorageObj('settings');
		settings[this._pokemonService.userLogin.username.toLowerCase()] = {};
		this._utils.setLocalStorageObj('settings', settings);
	}

	public saveUserSetting(setting: string, value: any) {
		let settings = this._utils.getLocalStorageObj('settings');
		settings[this._pokemonService.userLogin.username.toLowerCase()][setting] = value;
		this._utils.setLocalStorageObj('settings', settings);
	}

	public getUserSetting(setting:string): any {
		if(this._utils.doesLocalStorageHaveItem('settings')){
			let settings = this._utils.getLocalStorageObj('settings');

			if(this._pokemonService.userLogin !== null){
				if(settings.hasOwnProperty(this._pokemonService.userLogin.username.toLowerCase())){
					let userSettings = settings[this._pokemonService.userLogin.username.toLowerCase()];

					if(userSettings.hasOwnProperty(setting)){
						return userSettings[setting];
					}
				} else {
					this.createUserSettings();
				}
			}
		} else {
			this.createSettings();
		}

		return this._properties[setting];
	}

		public isStatSelected(heading: string): boolean {
		let stats = this.getUserSetting('pokemonTableStats');
		for(let idx = 0; idx < stats.length; idx++){
			let stat = stats[idx];
			if(stat.heading === heading) {
				return true;
			}
		}

		return false;
	}

	public statChanged(heading: string) {
		let userStats = this.getUserSetting('pokemonTableStats').slice();

		if(this.isStatSelected(heading)){
			for(let idx = 0; idx < userStats.length; idx++){
				let userStat = userStats[idx];

				if(userStat.heading === heading){
					userStats.splice(idx, 1);
					break;
				}
			}
		} else {
			let allStats = this._properties.pokemonTableStats;
			let newUserStats = [];

			//this is gross, but I couldn't think of a better way to
			//retain order of headings
			for(let aidx = 0; aidx < allStats.length; aidx++){
				let stat = allStats[aidx];

				let statFound = false;

				for(let uidx = 0; uidx < userStats.length; uidx++){
					if(userStats[uidx].heading === stat.heading){
						statFound = true;
						break;
					}
				}

				if(statFound || stat.heading === heading){
					newUserStats.push(stat)
				}
			}

			userStats = newUserStats;
		}

		this.saveUserSetting('pokemonTableStats', userStats);
	}
}