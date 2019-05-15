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