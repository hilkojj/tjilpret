
var friends = new Subject("friends", {

    friends: {},
    sentInvites: {},
    receivedInvites: {}

});

function updateFriends() {

    if (window.userSession == null)
        return;

    console.log("updating friends...");

    $.ajax({
        url: "/api/myFriendsAndInvites",
        method: "post",
        data: { token: window.userSession.token },
        success: function (res) {

            var keys = ["friends", "sentInvites", "receivedInvites"];
            for (var i in keys) {
                var key = keys[i];
                if (key in res)
                    friends.data[key] = res[key];
            }
            friends.notify();
        }
    });
}

friends.onSessionCreated = updateFriends;
setInterval(updateFriends, 8000);

function showFriendsCount(data, q) {
    var count = 0;
    for (var i in data.friends) count++;
    q.html(count);
}

function updateFriendButton(data, btn) {

    var id = btn.attr("data-user-id");
    var onclick = "";
    var redHover = true;
    var removeOnclickAfterClick = true;
    var width = 0;

    if (id in data.friends) {
        btn.html(`
            <span class="normal"><i class="material-icons left">done</i>vriends</span>
            <span class="on-hover"><i class="material-icons left">close</i>verbreek</span>
        `);
        width = 150;
        removeOnclickAfterClick = false;
        onclick = "removeFriend(" + id + ")";

    } else if (id in data.sentInvites) {
        btn.html(`
            <span class="normal"><i class="material-icons left">send</i>aangevraagd</span>
            <span class="on-hover"><i class="material-icons left">undo</i>toch niet</span>
        `);
        width = 190;
        onclick = "undoInvite(" + id + ")";

    } else if (id in data.receivedInvites) {
        btn.html(`
            <i class="material-icons left">email</i>reageer!!
        `);
        redHover = false;
        onclick = "confirmFriendship(" + id + ", true, false)";
    } else {
        var wide = btn.attr("data-wide") == 1;
        btn.html(`
            <i class="material-icons left">person_add</i>` + (wide ? "Vraag om vriendschap" : "toefoegen") + `
        `);
        redHover = false;
        onclick = "invite(" + id + ")";
    }

    btn.css("width", width == 0 ? "auto" : width + "px");
    if (redHover && !mobile) btn.addClass("red-hover");
    else btn.removeClass("red-hover");

    btn.attr("onclick", onclick + (removeOnclickAfterClick ? "; $(this).attr('onclick', '');" : ""));
}

function invite(id) {
    $.ajax({
        url: "/api/invite",
        method: "post",
        data: { 
            token: window.userSession.token,
            invitedID: id
        },
        success: function (res) {
            if (!res.success) showError("Ecxuses er ging iets mis");
            else updateFriends();
        }
    });
}

function undoInvite(id) {
    $.ajax({
        url: "/api/undoInvite",
        method: "post",
        data: { 
            token: window.userSession.token,
            invitedID: id
        },
        success: function (res) {
            if (!res.success) showError("Ecxuses er ging iets mis");
            else updateFriends();
        }
    });
}

function confirmFriendship(id, showConfirm, accept) {
    $.ajax({
        url: "/api/confirmFriendship",
        method: "post",
        data: { 
            token: window.userSession.token,
            inviterID: id,
            accept: (showConfirm ? confirm("Vriendschapsaanvraag accepteren?") : accept)
        },
        success: function (res) {
            if (!res.success) showError("Ecxuses er ging iets mis");
            else updateFriends();
        }
    });
}

function removeFriend(id) {
    if (!confirm("vriendschap opheffen??")) return;
    $.ajax({
        url: "/api/removeFriend",
        method: "post",
        data: { 
            token: window.userSession.token,
            friendID: id
        },
        success: function (res) {
            if (!res.success) showError("Ecxuses er ging iets mis");
            else updateFriends();
        }
    });
}