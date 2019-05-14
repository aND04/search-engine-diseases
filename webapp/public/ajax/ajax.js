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

    console.log(data);

    //pedido AJAX artigo
    $.ajax({
        url: domain + articleResource,
        data: data,
        method: "POST",
        success: function (result_article) {
            console.log(result_article);

            var trHTML = '';
            $.each(result_article, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.title))) +
                    '</td><td>' + decodeURIComponent(escape(window.atob(item.abstract))) +
                    '</td><td> <a target="_blank" href= https://www.ncbi.nlm.nih.gov/pubmed/' + item.pubmed_id + '> https://www.ncbi.nlm.nih.gov/pubmed/ ' + item.pubmed_id + '</a></td>' +
                    '<td>' + item.pub_Date + '</td></tr>';
            });
            $('#article').append(trHTML);

        }
    })

    //pedido AJAX tweet
    $.ajax({
        url: domain + tweetResource,
        data: data,
        method: "POST",

        success: function (result_tweet) {
            console.log(result_tweet);

            var trHTML = '';
            $.each(result_tweet, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.description))) + '</td><td> <a target="_blank" href="' + item.url + '">  ' + item.url + '</a></td><td>' + item.tweet_date + '</td></tr>';
            });
            $('#twitter').append(trHTML);
        }


    })

    //pedido AJAX flickr
    $.ajax({
        url: domain + flickrResource,
        data: data,
        method: "POST",
        success: function (result_flickr) {

            console.log(result_flickr);

            var trHTML = '';
            $.each(result_flickr, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.title))) +
                    '</td><td> <a target="_blank" href="' + item.url + '">  ' + item.url + '</a></td><td>' + item.flickr_date + '</td></tr>';
            });
            $('#flickr').append(trHTML);
        }
    })

    //pedido AJAX metadata
    $.ajax({
        url: domain + metadataResource,
        data: data,
        method: "POST",
        success: function (result_metadata) {

            console.log(result_metadata);

            var trHTML = '';
            $.each(result_metadata, function (i, item) {
                trHTML += '<tr><td>' + item.wikipageId +
                    '</td><td> <a target="_blank" href="' + item.uri + '">  ' + item.uri + '</a></td><td>  ' +
                    '<img src="' + item.image + '" width="420" height="420"> </td><td>' + decodeURIComponent(escape(window.atob(item.comment))) + '</td></tr>';
            });
            $('#metadata').append(trHTML);

        }
    })

    //pedido AJAX disease
    $.ajax({
        url: domain + diseaseResource,
        data: data,
        method: "POST",
        success: function (result_disease) {
            console.log(result_disease);


            var trHTML = '';
            $.each(result_disease, function (i, item) {
                trHTML += '<tr><td>' + item.dbpedia_disease_id +
                    '</td><td>'+ item.description + '</td></tr>';
            });
            $('#related_diseases').append(trHTML);
        }

    })
}