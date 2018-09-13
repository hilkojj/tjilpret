import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

    transform(timestamp: number, option?: string): string {

        var a = new Date(timestamp > 1000000000000 ? timestamp : timestamp * 1000);
        var b = new Date();

        var year = a.getFullYear();
        var month = a.getMonth();
        var date = a.getDate();
        var hour = a.getHours();
        var min: any = a.getMinutes();
        var string = '';
        var minStr = min < 10 ? "0" + min : min;

        if (option == "onlyTime") return hour + ":" + minStr;

        if (option == "short") {

            var thisYear = year == b.getFullYear();
            var thisMonth = a.getMonth() == b.getMonth();

            if (thisYear && thisMonth) {

                if (date == b.getDate() -1) return "Gisteren";
                if (date == b.getDate()) return hour + ":" + minStr;
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
        
        string += 'om ' + hour + ':' + minStr;
        return string;

    }

}
