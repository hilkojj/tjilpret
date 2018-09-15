import { Injectable } from '@angular/core';
import { WEB_PUSH_PUBLIC_KEY, API_URL } from '../constants';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ServiceWorkerService {

    registration: ServiceWorkerRegistration;
    saved = false;
    triedToSubscribe = false;

    get notDenied(): boolean {
        return (Notification as any).permission != "denied";
    }

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private router: Router
    ) {
        if (!('serviceWorker' in navigator)) {
            // Service Worker isn't supported on this browser, disable or hide UI.
            return;
        }
        var calledSubscribe = false;
        navigator.serviceWorker.register('/assets/tjille-service-worker.js?v=2')
            .then(reg => {
                console.log("service worker registered");
                this.registration = reg;
                if (auth.session && !calledSubscribe) {
                    calledSubscribe = true;
                    this.subscribeToPush(false);
                }

                navigator.serviceWorker.addEventListener("message", event => {
                    var data = event.data;
                    if (data.goTo) router.navigateByUrl(data.goTo);
                });
            });

        auth.onAuthenticatedListeners.push(() => {

            if (this.registration) {
                calledSubscribe = true;
                this.subscribeToPush(false);
            }

        });
    }

    async subscribeToPush(ask: boolean) {

        if (!this.registration)
            return console.error("No serviceWorker registered");

        if (!('PushManager' in window))
            return console.error("Push isn't supported on this browser");

        var permission = ask ? (await this.askPermission()) : (Notification as any).permission;
        if (permission != "granted") {
            this.triedToSubscribe = true;
            return;
        }

        var subscription = await this.registration.pushManager.getSubscription();
        if (subscription) {
            console.log("already subscribed");
            return this.saveSubscriptionToServer(subscription);
        }

        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
                WEB_PUSH_PUBLIC_KEY
            )
        };

        subscription = await this.registration.pushManager.subscribe(subscribeOptions);

        console.log("Gesubscribed voor push notificaties", subscription.toJSON());
        this.saveSubscriptionToServer(subscription);
    }

    private saveSubscriptionToServer(subscription: PushSubscription) {
        this.http.post(API_URL + "savePushSubscription", {
            token: this.auth.session.token,
            subscription: subscription.toJSON()
        }).subscribe((res: any) => {
            console.log("save subscription", res);
            if (res.success) this.saved = true;
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
     * used in pushManager.subscribe to correctly encode the key to an Uint8Array
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
