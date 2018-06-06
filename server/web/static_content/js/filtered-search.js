
function showFilteredSearch(parent, filters, url, resultsViewer) {
    getFragment("filtered-search", function (searchPage) {
        parent.append(searchPage);

        var searchFun = function () { filteredSearch(searchPage, url, resultsViewer, 0); };

        var coll = searchPage.find('.collapsible');
        coll.collapsible();
        var collBody = coll.find(".collapsible-body");

        for (var filterIndex in filters) {

            var filter = filters[filterIndex];
            var optionsHtml = "";
            if ("default" in filter) {
                var option = filter.default;
                optionsHtml += `<option value="` + option + `">` + filter.options[option] + `</option>`;
                delete filter.options[option];
            }
            for (var option in filter.options)
                optionsHtml += `<option value="` + option + `">` + filter.options[option] + `</option>`;

            var dropdown = $(`
                <div class="input-field col s12 l6">
                    <select name="` + filterIndex + `">` + optionsHtml + `</select>
                    <label>` + filter.name + `</label>
                </div>`
            );

            collBody.append(dropdown);
            var select = dropdown.find("select");
            select.change(searchFun);
            select.formSelect();
        }

        var input = searchPage.find("#search-input");
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

function filteredSearch(searchPage, url, resultsViewer, page) {
    var form = searchPage.find("form");
    console.log(form.serialize());
    var data = { q: form.find("input").val() };
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
                var resultsDiv = searchPage.find("#search-results");
                if (page == 0) resultsDiv.html("");
                resultsViewer(res, resultsDiv);
            }
        });

    });
}