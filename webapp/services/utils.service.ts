import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
	public pad(num: number, size: number): string {
		let s = num+'';
		while(s.length < size) s = '0' + s;
		return s;
	}

	public doesLocalStorageHaveItem(key: string): boolean {
		return localStorage.getItem(key) !== null;
	}

	public setLocalStorageObj(key: string, obj: any) {
		localStorage.setItem(key, JSON.stringify(obj));
	}

	public getLocalStorageObj(key: string): any {
		return JSON.parse(localStorage.getItem(key));
	}

	public setLocalStorageBool(key: string, bool: boolean) {
		localStorage.setItem(key, bool.toString());
	}

	public getLocalStorageBool(key: string): boolean {
		return localStorage.getItem(key).toLowerCase() === 'true';
	}

}
