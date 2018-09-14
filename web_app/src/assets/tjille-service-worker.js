self.addEventListener("push", event => {

    var data = event.data.json();
    console.log("push", data);
    var promiseChain;

    if (data.message) {
        var mess = data.message;
        var isGroup = mess.groupTitle ? true : false;
        promiseChain = self.registration.showNotification(
            isGroup ? mess.groupTitle : mess.senderUsername, {

                body: (isGroup ? `${mess.senderUsername}: ` : "") + mess.text,

                icon: "https://tjilpret.tk/static_content/profile_pics/med/" + mess.senderProfilePic,

                data
            }
        );
    } else {
        promiseChain = self.registration.showNotification(
            "Kans op berichten op tjilpret"
        );
    }

    event.waitUntil(promiseChain);
});

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