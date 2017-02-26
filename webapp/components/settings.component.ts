import { Component } from '@angular/core';

import { PropertiesService } from '../services/properties.service'
import { SettingsService } from '../services/settings.service'
import { SortService } from '../services/sort.service'

@Component({
	selector: 'settings',
	templateUrl: './webapp/templates/settings.component.html',
	styleUrls: ['./webapp/styles/settings.component.css']
})

export class SettingsComponent {
	constructor(
		private _properties: PropertiesService,
		private _settingsService: SettingsService,
		private _sortService: SortService
		){ }
}