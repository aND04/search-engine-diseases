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
    var diseaseName = $("#myInput").val();

    //pedido AJAX artigo
    $.ajax({
        url: domain + articleResource,
        data: data,
        method: "POST",
        success: function (result_article) {

            //criar o titulo das colunas
            var titles = '<th>Title</th><th>Abstract</th><th>Pubmed</th><th>Date</th>th>Rate</th>';

            //escreve as linhas na tabela
            var trHTML = ''
            $.each(result_article, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.title))) +
                    '</td><td>' + decodeURIComponent(escape(window.atob(item.abstract))) +
                    '</td><td> <a target="_blank" onclick="implicitFeed()" href= https://www.ncbi.nlm.nih.gov/pubmed/' + item.pubmed_id + '> https://www.ncbi.nlm.nih.gov/pubmed/ ' + item.pubmed_id + '</a></td>' +
                    '<td>' + new Date(item.pub_Date).toUTCString() + '</td></tr>' + 
                    '<td>' + '<ul id=\'thumbs\ \text-left\' style="font-size:40px;width:min-content;alignment:left">' +
                    '<span class=\'up\' title=\'LIKE\' >' +
                    '<br>' +
                    '<i class="fa fa-thumbs-o-up" onclick="increaseExpFeed()">' + '</i></span>' +
                    '<span class=\'down\' title=\'DISLIKE\'">' +
                    '<i class="fa fa-thumbs-o-down" onclick="decreaseExpFeed()" ' + '</i></span>' +
                    '</ul>' + '</td></tr>';
            });

            // limpar as linhas
            $('#article').empty().append(titles).append(trHTML);

            //função para o hifhlight
            function getWordsNumber(){

                let inputText = document.getElementById("article");
                let innerHTML = inputText.innerHTML;
                let word = innerHTML.match(new RegExp(diseaseName, "igm"));
                let numberOfOccurrences = innerHTML.match(new RegExp(diseaseName, "igm")).length;

                //ciclo for para sublinhar o nome da doença no artigo
                for(let i = 0; i<numberOfOccurrences; i++){
                    let res = innerHTML.replace(new RegExp(diseaseName, "igm"), "<span class='highlight' style='background-color:yellow;'>" + word[i]+"</span>");
                    innerHTML = res;
                }
                inputText.innerHTML = innerHTML;

            }

            getWordsNumber();
        }
    })

    //pedido AJAX twitter
    $.ajax({
        url: domain + tweetResource,
        data: data,
        method: "POST",

        success: function (result_tweet) {

            //criar o titulo das colunas
            var titles = '<tr> <em>Twitter photos</em><th>Description</th> <th>URL</th> <th>Date</th> </tr>';

            //escreve as linhas na tabela
            var trHTML = '';
            $.each(result_tweet, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.description))) + '</td><td> <a target="_blank" href="' + item.url + '">  ' + item.url + '</a></td><td>' + new Date(item.tweet_date).toUTCString() + '</td></tr>';
            });

            // limpar as linhas
            $('#twitter').empty().append(titles).append(trHTML);
        }


    })

    //pedido AJAX flickr
    $.ajax({
        url: domain + flickrResource,
        data: data,
        method: "POST",
        success: function (result_flickr) {

            //criar o titulo das colunas
            var titles = '<tr> <em>Flirck photos</em> <th>Title</th> <th>URL</th> <th>Date</th> </tr>';

            //escreve as linhas na tabela
            var trHTML = '';
            $.each(result_flickr, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.title))) +
                    '</td><td> <a target="_blank" href="' + item.url + '">  ' + item.url + '</a></td><td>' + new Date(item.flickr_date).toUTCString() + '</td></tr>';
            });

            // limpar as linhas
            $('#flickr').empty().append(titles).append(trHTML);
        }
    })

    //pedido AJAX metadata
    $.ajax({
        url: domain + metadataResource,
        data: data,
        method: "POST",
        success: function (result_metadata) {

            //criar o titulo das colunas
            var titles = '<tr><em>More info</em><th>wikipageId</th><th>URI</th> <th>Image</th> <th>Comment</th></tr>';

            //escreve as linhas na tabela
            var trHTML = '';
            $.each(result_metadata, function (i, item) {
                trHTML += '<tr><td>' + item.wikipageId +
                    '</td><td> <a target="_blank" href="' + item.uri + '">  ' + item.uri + '</a></td><td>  ' +
                    '<img src="' + item.image + '" width="420" height="420"> </td><td>' + decodeURIComponent(escape(window.atob(item.comment))) + '</td></tr>';
            });

            // limpar as linhas
            $('#metadata').empty().append(titles).append(trHTML);

        }
    })

    //pedido AJAX disease
    $.ajax({
        url: domain + diseaseResource,
        data: data,
        method: "POST",
        success: function (result_disease) {

            //criar o titulo das colunas
            var titles = '<tr> <em>Related Diseases</em> <th>Id</th> <th>Disease Name</th></tr>';

            //escreve as linhas na tabela
            var trHTML = '';
            $.each(result_disease, function (i, item) {
                trHTML += '<tr><td>' + item.dbpedia_disease_id +
                    '</td><td>'+ item.description + '</td></tr>';
            });

            // limpar as linhas
            $('#related_diseases').empty().append(titles).append(trHTML);
        }

    })
}

function implicitFeed(){
    
}

function increaseExpFeed() {

}

function decreaseExpFeed() {

    }
