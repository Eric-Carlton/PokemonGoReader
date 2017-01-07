import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'prependZeros'})
export class PrependZerosPipe implements PipeTransform {
  transform(value: string): string {
    return("00"+ value ).slice(-3);
  }
}
