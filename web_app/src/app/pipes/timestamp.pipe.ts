import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

    transform(timestamp: number, option?: string): string {

        var a = new Date(timestamp * 1000);
        var b = new Date();

        var year = a.getFullYear();
        var month = a.getMonth();
        var date = a.getDate();
        var hour = a.getHours();
        var min: any = a.getMinutes();
        var string = '';

        if (option == "short") {

            var thisYear = year == b.getFullYear();
            var thisMonth = a.getMonth() == b.getMonth();

            if (thisYear && thisMonth) {

                if (date == b.getDate() -1) return "Gisteren";
                if (date == b.getDate()) return hour + ":" + min;
            }

            return `${date}-${month + 1}-${year}`;
        }

        var months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
        
        if (year == b.getFullYear()) {
            if (date != b.getDate() || month != b.getMonth()) {
                if (month == b.getMonth() && b.getDate() - date == 1) {
                    string += 'Gisteren ';
                } else {
                    string += date + ' ' + months[month] + ' ';
                }
            }
        } else {
            string += date + ' ' + months[month] + ' ' + year + ' ';
        }
        if (min < 10) {
            min = '0' + min;
        }
        string += 'om ' + hour + ':' + min;
        return string;

    }

}
