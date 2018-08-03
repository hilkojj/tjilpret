import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SpeechService {

    constructor() { }

    speak(text: string) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.lang = 'nl';
        msg.rate = .85;
        
        speechSynthesis.speak(msg);

        // this is a fix for a bug (https://stackoverflow.com/questions/42875726/speechsynthesis-speak-in-web-speech-api-always-stops-after-a-few-seconds-in-go)
        var interval = setInterval(() => {
            speechSynthesis.resume();
            if (!speechSynthesis.speaking)
                clearInterval(interval);
        }, 1000);
    }

}
