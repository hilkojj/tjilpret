// show notification:
self.addEventListener("push", event => {

    var data = event.data.json();
    var promiseChain;

    if (data.message) {
        var mess = data.message;
        var isGroup = mess.groupTitle ? true : false;
        var renotify = true;

        promiseChain = self.registration.getNotifications().then(notifications => {

            var numberOfMessages = 1;
            data.firstTimestamp = mess.sentTimestamp;
            for (var n of notifications) if (
                n.data && n.data.message && n.data.message.chatId == mess.chatId
            ) {
                numberOfMessages += n.data.prevMessages || 1;
                if (n.data.firstTimestamp) firstTimestamp = n.data.firstTimestamp;
                if (mess.sentTimestamp - n.data.firstTimestamp < 4000 && n.data.message.text.length > 7)
                    renotify = false;
            }
            data.prevMessages = numberOfMessages;
            if (!renotify) data.firstTimestamp = firstTimestamp;

            var body = numberOfMessages > 1 ? numberOfMessages + " niwe berichten" :
                (isGroup ? `${mess.senderUsername}: ` : "") + mess.text

            return self.registration.showNotification(
                isGroup ? mess.groupTitle : mess.senderUsername, {

                    body,

                    icon: "https://tjilpret.tk/static_content/profile_pics/med/" + mess.senderProfilePic,

                    data,

                    badge: "/assets/img/notification_badge.png",

                    vibrate: getVibrationPattern(mess.text),

                    tag: mess.chatId,
                    renotify
                }
            );
        });

    } else {
        promiseChain = self.registration.showNotification(
            "Kans op berichten op tjilpret"
        );
    }

    event.waitUntil(promiseChain);
});

const getVibrationPattern = text => {
    const words = text.slice(0, 25).trim().split(" ");

    var arr = [];

    var duration = 0;
    for (var word of words) {
        if (duration > 1600) break;
        var d = Math.max(Math.min(word.length * 60, 800), 200);
        arr.push(d);
        arr.push(300);
    }
    return arr;
}

// open chat on click:
self.addEventListener("notificationclick", event => {

    var urlToOpen = "/tjets/";

    var data = event.notification.data;
    if (data.message)
        urlToOpen = "/tjets/" + data.message.chatId;

    const promiseChain = clients.matchAll({

        type: "window",
        includeUncontrolled: true

    }).then(windowClients => {
        let matchingClient = windowClients[0];

        if (matchingClient) {
            matchingClient.postMessage({
                goTo: urlToOpen
            });
            return matchingClient.focus();
        } else {
            return clients.openWindow(urlToOpen);
        }
    });

    event.waitUntil(promiseChain);
});