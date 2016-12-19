import { Pipe, PipeTransform } from '@angular/core';

/**
 * @deprecated
 */
@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
    public transform(value, args: string[]): any {
        return Object.keys(value).map(key => value[key]);
    }
}
