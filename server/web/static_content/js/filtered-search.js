
function showFilteredSearch(parent, filters, url, resultsViewer, placeholder, htmlOnNoResults, htmlOnNoResultsWithInput) {
    getFragment("filtered-search", function (searchPage) {
        parent.append(searchPage);

        var loader = searchPage.find("#search-loader");
        var id = Math.random() * 100000 | 0;
        searchPage.attr("id", id);
        var page = 0;
        var input = searchPage.find("#search-input");
        var loadingNewPage = false;
        var endReached = false;
        var interval = setInterval(function () {
            if ($("#" + id).length == 0) clearInterval(interval);

            else if (!loadingNewPage && !endReached && loader.isInViewport()) {
                if (!endReached) loader.css("opacity", 1);
                loadingNewPage = true;
                console.log("download more");
                filteredSearch(searchPage, url, resultsViewer, ++page, function (i) {
                    loadingNewPage = false;
                    endReached = i == 0;
                    if (endReached) loader.css("opacity", 0);
                });
            }
        }, 400);

        var searchFun = function () { 
            page = 0;
            endReached = false;
            filteredSearch(searchPage, url, resultsViewer, 0, function (i) {
                searchPage.find("#on-no-results").html(
                    i == 0 ? (input.val() == "" || typeof htmlOnNoResultsWithInput == "undefined" ? 
                    htmlOnNoResults : htmlOnNoResultsWithInput) + "<br><br>" 
                    : ""
                );
            }); 
        };

        var coll = searchPage.find('.collapsible');
        coll.collapsible();
        var collBody = coll.find(".collapsible-body");

        var nFilters = 0;
        for (var filterIndex in filters) {
            nFilters++;
            var filter = filters[filterIndex];
            var optionsHtml = "";
            if ("default" in filter) {
                var option = filter.default;
                optionsHtml += optionHtml(option, filter, filterIndex);
                delete filter.options[option];
            }
            for (var option in filter.options) optionsHtml += optionHtml(option, filter, filterIndex);

            var dropdown = $(`
                <div class="input-field col s12 l6">
                    <label style="position: initial">` + filter.name + `</label>
                    <select class="browser-default" name="` + filterIndex + `">` + optionsHtml + `</select>
                </div>`
            );

            collBody.append(dropdown);
            var select = dropdown.find("select");
            select.change(searchFun);
            select.formSelect();
        }
        if (nFilters == 0) coll.remove();

        input.attr("placeholder", placeholder);
        var q = param("q");
        if (q != null && q != "") input.val(replaceAll(q, "+", " "));
        var timeout = false;
        input.on("input", function () {
            if (timeout)
                return;

            var results = searchPage.find("#search-results");
            timeout = true;
            results.css("opacity", .3);

            setTimeout(function () {
                timeout = false;
                searchFun();
                results.css("opacity", 1);
            }, 800);
        });
        searchFun();
    });
}

function optionHtml(option, filter, filterIndex) {
    return `<option value="` + option + `" ` + (
        param(filterIndex) == option ? "selected" : ""
    ) + `>` + filter.options[option] + `</option>`;
}

function filteredSearch(searchPage, url, resultsViewer, page, callback) {
    var form = searchPage.find("form");

    history.replaceState(null, null, window.location.pathname + "?" + form.serialize());

    var data = { q: form.find("input").val(), page: page };
    form.find("select").each(function () {
        var select = $(this);
        data[select.attr("name")] = select.val();
    }).promise().done(function () {

        console.log(data);

        $.ajax({
            url: url,
            method: "post",
            data: data,
            success: function (res) {
                console.log("new page downloaded");
                var resultsDiv = searchPage.find("#search-results");
                if (page == 0) resultsDiv.html("");
                resultsViewer(res, resultsDiv, callback);
            }
        });

    });
}