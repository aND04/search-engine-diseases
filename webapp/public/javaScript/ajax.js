// inicia o script
$(document).ready(
    function () {

    }
)
var domain = "http://localhost:3000/";

//faz ligação ha pasta routes
var articleResource = "article";
var tweetResource = "tweet";
var flickrResource = "flickr";
var metadataResource = "metadata";
var diseaseResource = "disease";

//inicializa o metodo post do botão registar


function post() {
    // vai buscar o id registo e vai enviar para dentro do post
    var data = $("#disease").serialize();
    let diseaseName = $("#myInput").val();

    console.log(data);

    //pedido AJAX artigo
    $.ajax({
        url: domain + articleResource,
        data: data,
        method: "POST",
        success: function (result_article) {
            console.log(result_article);
            let titles = '<th>Title</th><th>Abstract</th><th>Pubmed</th><th>Date</th>';
            var trHTML = ''
            $.each(result_article, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.title))) +
                    '</td><td>' + decodeURIComponent(escape(window.atob(item.abstract))) +
                    '<section class=\'rating-widget\'>' +
                    '<ul id=\'stars\ text-center\'>' +
                    '<span class=\'star\' title=\'Poor\' data-value=\'1\'>' +
                    '<i class=\"fa fa-star fa-fw\">' + '</i>' +
                    '</span>' +
                    '<span class=\'star\' title=\'Fair\' data-value=\'2\'>' +
                    '<i class=\'fa fa-star fa-fw\'>' + '</i>' +
                    '</span>' +
                    '<span class=\'star\' title=\'Good\' data-value=\'3\'>' +
                    '<i class=\'fa fa-star fa-fw\'>' + '</i>' +
                    '</span>' +
                    '<span class=\'star\' title=\'Excellent\' data-value=\'4\'>' +
                    '<i class=\'fa fa-star fa-fw\'>' + '</i>' +
                    '</span>' +
                    '<span class=\'star\' title=\'WOW!!!\' data-value=\'5\'>' +
                    '<i class=\'fa fa-star fa-fw\'>' + '</i>' +
                    '</span>' +
                    '</ul>' +
                    '</div>' +
                    '</td><td> <a target="_blank" href= https://www.ncbi.nlm.nih.gov/pubmed/' + item.pubmed_id + '> https://www.ncbi.nlm.nih.gov/pubmed/ ' + item.pubmed_id + '</a></td>' +
                    '<td>' + item.pub_Date + '</td></tr>';
            });
            //$('#article').update(trHTML);
            $('#article').empty().append(titles).append(trHTML);

            function getWordsNumber(){
                let inputText = document.getElementById("article");
                let innerHTML = inputText.innerHTML;
                //let inputText = "asthma is bad asthma Asthma"

                let palavra = innerHTML.match(new RegExp(diseaseName, "igm"));
                //console.log("palavra: " + palavra);
                const numberOfOccurrences = innerHTML.match(new RegExp(diseaseName, "igm")).length;
                console.log("occorences: " + numberOfOccurrences);
                for(let i = 0; i<numberOfOccurrences; i++){
                    let res = innerHTML.replace(new RegExp(diseaseName, "igm"), "<span class='highlight' style='background-color:yellow;'>" + palavra[i]+"</span>");
                    innerHTML = res;
                }
                inputText.innerHTML = innerHTML;

            }

            getWordsNumber();
        }
    })

    //pedido AJAX tweet
    $.ajax({
        url: domain + tweetResource,
        data: data,
        method: "POST",

        success: function (result_tweet) {
            console.log(result_tweet);
            let titles = '<tr> <em>Twitter photos</em><th>Description</th> <th>URL</th> <th>Date</th> </tr>';
            var trHTML = '';
            $.each(result_tweet, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.description))) + '</td><td> <a target="_blank" href="' + item.url + '">  ' + item.url + '</a></td><td>' + item.tweet_date + '</td></tr>';
            });
            $('#twitter').empty().append(titles).append(trHTML);
        }


    })

    //pedido AJAX flickr
    $.ajax({
        url: domain + flickrResource,
        data: data,
        method: "POST",
        success: function (result_flickr) {

            console.log(result_flickr);
            let titles = '<tr> <em>Flirck photos</em> <th>Title</th> <th>URL</th> <th>Date</th> </tr>';
            var trHTML = '';
            $.each(result_flickr, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.title))) +
                    '</td><td> <a target="_blank" href="' + item.url + '">  ' + item.url + '</a></td><td>' + item.created_at + '</td></tr>';
            });
            $('#flickr').empty().append(titles).append(trHTML);
        }
    })

    //pedido AJAX metadata
    $.ajax({
        url: domain + metadataResource,
        data: data,
        method: "POST",
        success: function (result_metadata) {

            console.log(result_metadata);
            let titles = '<tr><em>More info</em><th>wikipageId</th><th>URI</th> <th>Image</th> <th>Comment</th></tr>';
            var trHTML = '';
            $.each(result_metadata, function (i, item) {
                trHTML += '<tr><td>' + item.wikipageId +
                    '</td><td> <a target="_blank" href="' + item.uri + '">  ' + item.uri + '</a></td><td>  ' +
                    '<img src="' + item.image + '" width="420" height="420"> </td><td>' + decodeURIComponent(escape(window.atob(item.comment))) + '</td></tr>';
            });
            $('#metadata').empty().append(titles).append(trHTML);

        }
    })

    //pedido AJAX disease
    $.ajax({
        url: domain + diseaseResource,
        data: data,
        method: "POST",
        success: function (result_disease) {
            console.log(result_disease);

            let titles = '<tr> <em>Related Diseases</em> <th>Id</th> <th>Disease Name</th></tr>';
            var trHTML = '';
            $.each(result_disease, function (i, item) {
                trHTML += '<tr><td>' + item.dbpedia_disease_id +
                    '</td><td>'+ item.description + '</td></tr>';
            });
            $('#related_diseases').empty().append(titles).append(trHTML);
        }

    })
}
