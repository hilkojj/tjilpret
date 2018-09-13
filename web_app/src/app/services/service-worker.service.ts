import { Injectable } from '@angular/core';
import { WEB_PUSH_PUBLIC_KEY } from '../constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ServiceWorkerService {

    constructor(
        private http: HttpClient
    ) {

    }

    async register() {

        if (!('serviceWorker' in navigator)) {
            // Service Worker isn't supported on this browser, disable or hide UI.
            return;
        }

        if (!('PushManager' in window)) {
            // Push isn't supported on this browser, disable or hide UI.
            return;
        }

        var permission = await this.askPermission();
        if (permission != "granted") return;

        navigator.serviceWorker.register('/assets/tjille-service-worker.js')
            .then(registration => this.subscribe(registration));
    }

    private subscribe(registration: ServiceWorkerRegistration) {

        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
                WEB_PUSH_PUBLIC_KEY
            )
        };
        registration.pushManager.subscribe(subscribeOptions).then(pushSub => {

            console.log("Gesubscribed voor push notificaties", pushSub.toJSON());
            
        });
    }

    askPermission(): Promise<any> {
        var p = new Promise((resolve, reject) => {
            const permissionResult = Notification.requestPermission(resolve);

            if (permissionResult) permissionResult.then(resolve, reject);

        });

        p.then(permissionResult => {
            if (permissionResult !== 'granted') {
                console.error("Geen toestemming voor notificaties gegeven")
                return;
            }

            console.info("Toestemming voor notificaties gegeven");
        });

        return p;
    }

    /**
     * used in pushManager.Subscribe to correctly encode the key to a Uint8Array
     * 
     * https://gist.github.com/malko/ff77f0af005f684c44639e4061fa8019
     * 
     * @param base64String 
     */
    private urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

}
