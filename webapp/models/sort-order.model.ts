import { SortType } from './sort-type.model'

export class SortOrder{
	constructor(
		public name: string,
		public sort_types: SortType[]
	) { }
}