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

                icon: "https://tjilpret.tk/static_content/profile_pics/med/" + mess.senderProfilePic

            }
        );
    } else {
        promiseChain = self.registration.showNotification(
            "Kans op berichten op tjilpret"
        );
    }

    event.waitUntil(promiseChain);
});