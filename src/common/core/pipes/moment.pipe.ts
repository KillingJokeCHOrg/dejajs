import { Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'stringToDateFormat' })
export class StringToDateFormatPipe implements PipeTransform {
    public transform(dateString, format: string): any {
        return moment(dateString, 'DD.MM.YYYY HH:mm:ss').format(format);
    }
}
