import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

    transform(timestamp: number, args?: any): string {

        var a = new Date(timestamp * 1000);
        var b = new Date();
        var months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min: any = a.getMinutes();
        var string = '';
        if (year == b.getFullYear()) {
            if (date != b.getDate() || month != months[b.getMonth()]) {
                if (month == months[b.getMonth()] && b.getDate() - date == 1) {
                    string += 'Gisteren ';
                } else {
                    string += date + ' ' + month + ' ';
                }
            }
        } else {
            string += date + ' ' + month + ' ' + year + ' ';
        }
        if (min < 10) {
            min = '0' + min;
        }
        string += 'om ' + hour + ':' + min;
        return string;

    }

}
