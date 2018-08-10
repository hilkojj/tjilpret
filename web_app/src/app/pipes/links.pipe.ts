import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'links'
})
export class LinksPipe implements PipeTransform {

    transform(value: string, args?: any): any {
        return (value || "").replace(
            /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
            function (match, space, url) {
                var hyperlink = url;
                if (!hyperlink.match('^https?:\/\/')) {
                    hyperlink = 'http://' + hyperlink;
                }
                return space + '<a href="' + hyperlink + '" target="_blank">' + url + '</a>';
            }
        );
    }

}
