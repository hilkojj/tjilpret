window.paths["/amusement"] = function () {

    startActivity("uploads-index", true, function () {

        var splitted = window.location.pathname.split("/");
        var page = splitted[2] || "beste";
        console.log(page);

        var tabs = {
            beste: {
                title: "beste",
                icon: "trending_up",
                queryData: { orderBy: "best" }
            },
            meestbekeken: {
                title: "meest bekeken",
                icon: "remove_red_eye",
                queryData: { orderBy: "views" }
            },
            nieuw: {
                title: "nieuw",
                icon: "new_releases",
                queryData: { orderBy: "date" }
            },
            pretbedervers: {
                title: "pretbedervers",
                icon: "trending_down",
                queryData: {
                    orderBy: "best",
                    desc: 0
                }
            },
            niewsberigten: {
                title: "niewsberigten",
                icon: "receipt",
                queryData: { cat: 3 }
            }
        };
        var tabsDiv = $("#uploads-tabs");

        for (var i in tabs) {
            var tab = tabs[i];
            tabsDiv.append(`
                <li class="tab">
                    <a class="waves-effect` + (i == page ? " active" : "") + `">
                        <i class="material-icons">` + tab.icon + `</i>
                        <br>` + tab.title + `
                    </a>
                </li>
            `);
        }

        setTimeout(function () { tabsDiv.tabs() }, 250);


    });

}