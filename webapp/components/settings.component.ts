import { Component } from '@angular/core';

import { PropertiesService } from '../services/properties.service'
import { UtilsService } from '../services/utils.service'

@Component({
	selector: 'settings',
	templateUrl: './webapp/templates/settings.component.html',
	styleUrls: ['./webapp/styles/settings.component.css']
})

export class SettingsComponent {
	private _useTabularFormat: boolean;
	private _showTransferButton: boolean;
	private _showRenameButton

	constructor(
		private _properties: PropertiesService,
		private _utils: UtilsService
	){ 
		this._useTabularFormat = this._utils.doesLocalStorageHaveItem('useTabularFormat') ? this._utils.getLocalStorageBool('useTabularFormat') : this._properties.useTabularFormat;
		this._showTransferButton = this._utils.doesLocalStorageHaveItem('showTransferButton') ? this._utils.getLocalStorageBool('showTransferButton') : this._properties.showTransferButton;
		this._showRenameButton = this._utils.doesLocalStorageHaveItem('showRenameButton') ? this._utils.getLocalStorageBool('showRenameButton') : this._properties.showRenameButton;
	}

	public get useTabularFormat(): boolean {
		return this._useTabularFormat;
	}

	public get showTransferButton(): boolean {
		return this._showTransferButton;
	}

	public get showRenameButton(): boolean {
		return this._showRenameButton;
	}

	public set useTabularFormat(useTabularFormat: boolean) {
		this._useTabularFormat = useTabularFormat;
		this._utils.setLocalStorageBool('useTabularFormat', useTabularFormat);
	}

	public set showTransferButton(showTransferButton: boolean) {
		this._showTransferButton = showTransferButton;
		this._utils.setLocalStorageBool('showTransferButton', showTransferButton);
	}

	public set showRenameButton(showRenamButton: boolean){
		this._showRenameButton = showRenamButton;
		this._utils.setLocalStorageBool('showRenamButton', showRenamButton);
	}
}