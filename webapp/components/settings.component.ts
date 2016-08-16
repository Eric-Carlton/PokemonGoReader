import { Component } from '@angular/core';

import { PropertiesService } from '../services/properties.service'
import { UtilsService } from '../services/utils.service'
import { PokemonService } from '../services/pokemon.service'

@Component({
	selector: 'settings',
	templateUrl: './webapp/templates/settings.component.html',
	styleUrls: ['./webapp/styles/settings.component.css']
})

export class SettingsComponent {
	constructor(
		private _properties: PropertiesService,
		private _utils: UtilsService,
		private _pokemonService: PokemonService
	){ }

	public get useTabularFormat(): boolean {
		return this._getUserSetting('useTabularFormat');
	}

	public get showTransferButton(): boolean {
		return this._getUserSetting('showTransferButton');
	}

	public get showRenameButton(): boolean {
		return this._getUserSetting('showRenameButton');
	}

	public set useTabularFormat(useTabularFormat: boolean) {
		this._saveUserSetting('useTabularFormat', useTabularFormat);
	}

	public set showTransferButton(showTransferButton: boolean) {
		this._saveUserSetting('showTransferButton', showTransferButton);
	}

	public set showRenameButton(showRenamButton: boolean){
		this._saveUserSetting('showRenameButton', showRenamButton);
	}

	private _createSettings(){
		this._utils.setLocalStorageObj('settings', {});
	}

	private _createUserSettings(){
		let settings = this._utils.getLocalStorageObj('settings');
		settings[this._pokemonService.userLogin.username] = {};
		this._utils.setLocalStorageObj('settings', settings);
	}

	private _saveUserSetting(setting: string, value: any){
		let settings = this._utils.getLocalStorageObj('settings');
		settings[this._pokemonService.userLogin.username][setting] = value;
		this._utils.setLocalStorageObj('settings', settings);
	}

	private _getUserSetting(setting:string): any {
		if(this._utils.doesLocalStorageHaveItem('settings')){
			let settings = this._utils.getLocalStorageObj('settings');

			if(this._pokemonService.userLogin !== null){
				if(settings.hasOwnProperty(this._pokemonService.userLogin.username)){
					let userSettings = settings[this._pokemonService.userLogin.username];

					if(userSettings.hasOwnProperty(setting)){
						return userSettings[setting];
					}
				} else {
					this._createUserSettings();
				}
			}
		} else {
			this._createSettings();
		}

		return this._properties[setting];
	}
}