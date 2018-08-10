import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'escape'
})
export class EscapePipe implements PipeTransform {

    constructor(
        private escaper: DomSanitizer
    ) { }

    transform(value: any, args?: any): any {
        return (value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

}
