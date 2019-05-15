//Routing
var domain = "http://localhost:3000/";
var autocomplete = 'disease/getDiseases';

/**
 * Get all diseases.
 * @returns Array with all diseases.
 */
async function getAllDiseases() {
    var diseases = [];  //Store the diseases
    $.ajax({
        url: domain + autocomplete,
        dataType: "json",
        method: "GET",
        success: function(data) {
            $.map(data, function(item) {
                diseases.push(item.description);
            });
        },
        error: function(xhr) {
            alert(xhr.status + ' : ' + xhr.statusText);
        }
    })
    return diseases;
}

/**
 * Gets the array of diseases and calls autocomplete function.
 * @returns {Promise<void>}
 */
async function autocompleteDisease() {
    var storeDiseases = await getAllDiseases();
    $('#myInput').autocomplete({
        source: storeDiseases,
        autofocus: true,
        select: function(event, ui) {
        }
    });
}

//Search only from the beginning of the string
$.ui.autocomplete.filter = function (array, term) {
    var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
    return $.grep(array, function (value) {
        return matcher.test(value.label || value.value || value);
    });
};

//Highlight the word
$.ui.autocomplete.prototype._renderItem = function (ul, item) {
    item.label = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" +
        $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"),
        "<strong>$1</strong>");
    return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a>" + item.label + "</a>")
        .appendTo(ul);
};