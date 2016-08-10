import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
	public pad(num: number, size: number): string {
		let s = num+'';
		while(s.length < size) s = '0' + s;
		return s;
	}

	public key(obj: any): string[] {
		return Object.keys(obj);
	}

}
