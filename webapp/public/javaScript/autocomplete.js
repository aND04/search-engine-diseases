//Routing
var domain = 'http://appserver.alunos.di.fc.ul.pt:3000/';
var autocomplete = 'disease/getDiseases';

/**
 * Get all diseases.
 * @returns Array with all diseases.
 */
async function getAllDiseases() {
    //TODO: replace with user choice input
    var type = 'application/json';

    var diseases = [];  //Store the diseases
    var content = {contentType: type};
    $.ajax({
        url: domain + autocomplete,
        method: "GET",
        data: content,
        success: function(data) {
            //Parse JSON
            if (type == 'application/json') {
                $.map(data, function(item) {
                    diseases.push(item.description);
                });
            //Parse XML
            } else if (type == 'application/xml') {
                $(data).find('disease').each(function() {
                    diseases.push($(this).find('description').text());
                });
                diseases.shift();
            }
        },
        error: function(xhr) {
            alert(xhr.status + ' : ' + xhr.statusText);
        }
    });
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
