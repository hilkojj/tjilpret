import { Pipe, PipeTransform } from '@angular/core';
import { CONTENT_URL } from '../constants';

@Pipe({
    name: 'emoticons'
})
export class EmoticonsPipe implements PipeTransform {

    transform(value: string, args?: any): string {

        var url = CONTENT_URL + "emoticons/";
        var matches = value.match(/:(\w*?):/g);

        if (!matches) return value;
        
        for (var match of matches) {
            var name = match.substr(1, match.length - 2);
            value = value.replace(
                match, 
                `<img class="inline-emoticon" src="${url}${name}.png" title="${name}">`
            );
        }

        return value;
    }

}
