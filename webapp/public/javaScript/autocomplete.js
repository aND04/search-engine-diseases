// inicia o script
$(document).ready(
    function () {

    }
)
var domain = "http://localhost:3000/";

//faz ligação ha pasta routes
var autocomplete = 'autocomplete';

function final() {
    $('#myInput').autocomplete({
        source: function (req, res) {
            $.ajax({
                url: domain + autocomplete + "/"+  req.term,
                dataType: "json",
                method: "GET",
                data: {
                    term: req.term
                },
                success: function(data) {
                    res($.map(data, function(item) {
                        console.log(item.description);
                        return item.description;
                    }));
                },
                error: function(xhr) {
                    alert(xhr.status + ' : ' + xhr.statusText);
                }
            })
        },
        select: function(event, ui) {

        }

    })
}

