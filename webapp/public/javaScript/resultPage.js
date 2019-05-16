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
var articleResourceFeedbackIncrease = "article/increaseExpFeed";
var articleRescourceFeedbackDecrease = "article/decreaseExpFeed";

//inicializa o metodo post do botão registar
var diseaseNameGlob;

function post() {

    var type = 'application/' + localStorage.getItem("contentType");

    // vai buscar o id registo e vai enviar para dentro do post
    var diseaseName = localStorage.getItem("disease");
    diseaseNameGlob=diseaseName;
    var data = 'disease_name=' + diseaseName + '&topn=' + localStorage.getItem("topn") +
        '&requestType=' + type;

    var articleList = [];           //Articles
    var tweetsList = [];            //Tweets
    var flickrList = [];            //Flickr photos
    var metadataList = [];          //Metadata
    var relatedDiseasesList = [];   //Related diseases

    //pedido AJAX artigo
    $.ajax({
        url: domain + articleResource,
        data: data,
        method: "POST",
        success: function (result_article) {
            //Parse JSON
            if (type == 'application/json') {
                $.map(result_article, function(item) {
                    articleList.push({
                        'title': item.title,
                        'abstract': item.abstract,
                        'pubmed_id': item.pubmed_id,
                        'pub_Date': new Date (item.pub_Date).toUTCString()
                    });
                });
            //Parse XML
            } else if (type == 'application/xml') {
                $(result_article).find('article').each(function() {
                    articleList.push({
                        'title': $(this).find('title').text(),
                        'abstract': $(this).find('abstract').text(),
                        'pubmed_id': $(this).find('pubmed_id').text(),
                        'pub_Date': new Date($(this).find('pubmed_id').text()).toUTCString()
                    });
                });
                articleList.shift();
            }

            //criar o titulo das colunas
            var titles = '<th>Title</th><th>Abstract</th><th>Pubmed</th><th>Date</th>th>Rate</th>';

            //escreve as linhas na tabela
            var trHTML = '';
            $.each(articleList, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.title))) +
                    '</td><td>' + decodeURIComponent(escape(window.atob(item.abstract))) +
                    '</td><td> <a target="_blank" onclick="implicitFeed()" href= https://www.ncbi.nlm.nih.gov/pubmed/' + item.pubmed_id + '> https://www.ncbi.nlm.nih.gov/pubmed/ ' + item.pubmed_id + '</a></td>' +
                    '<td>' + item.pub_Date + '</td></tr>' +
                    '<td>' + '<ul id=\'thumbs\ \text-left\' style="font-size:40px;width:min-content;alignment:left">' +
                    '<span class=\'up\' title=\'LIKE\' >' +
                    '<br>' +
                    '<i class="fa fa-thumbs-o-up" onclick="increaseExpFeed('+item.pubmed_id+'); changeColorUp(this);">' + '</i></span>' +
                    '<span class=\'down\' title=\'DISLIKE\'">' +
                    '<i class="fa fa-thumbs-o-down" onclick="decreaseExpFeed('+item.pubmed_id+'); changeColorDown(this);">' + '</i></span>' +
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
            //Parse JSON
            if (type == 'application/json') {
                $.map(result_tweet, function(item) {
                    tweetsList.push({
                        'description': item.description,
                        'url': item.url,
                        'tweet_date': new Date(item.tweet_date).toUTCString()
                    });
                });
                //Parse XML
            } else if (type == 'application/xml') {
                $(result_tweet).find('twitter').each(function() {
                    tweetsList.push({
                        'description': $(this).find('description').text(),
                        'url': $(this).find('url').text(),
                        'tweet_date': new Date($(this).find('tweet_date').text()).toUTCString()
                    });
                });
                tweetsList.shift();
            }

            //criar o titulo das colunas
            var titles = '<tr> <em>Twitter photos</em><th>Description</th> <th>URL</th> <th>Date</th> </tr>';

            //escreve as linhas na tabela
            var trHTML = '';
            $.each(tweetsList, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.description))) + '</td><td> <a target="_blank" href="' + item.url + '">  ' + item.url + '</a></td><td>' + item.tweet_date + '</td></tr>';
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
            if (type == 'application/json') {
                $.map(result_flickr, function(item) {
                    flickrList.push({
                        'title': item.title,
                        'url': item.url,
                        'flickr_date': new Date(item.flickr_date).toUTCString()
                    });
                });
                //Parse XML
            } else if (type == 'application/xml') {
                $(result_flickr).find('flickr').each(function() {
                    flickrList.push({
                        'title': $(this).find('title').text(),
                        'url': $(this).find('url').text(),
                        'flickr_date': new Date($(this).find('flickr_date').text()).toUTCString()
                    });
                })
                flickrList.shift();
            }

            //criar o titulo das colunas
            var titles = '<tr> <em>Flirck photos</em> <th>Title</th> <th>URL</th> <th>Date</th> </tr>';

            //escreve as linhas na tabela
            var trHTML = '';
            $.each(flickrList, function (i, item) {
                trHTML += '<tr><td>' + decodeURIComponent(escape(window.atob(item.title))) +
                    '</td><td> <a target="_blank" href="' + item.url + '">  ' + item.url + '</a></td><td>' + item.flickr_date + '</td></tr>';
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
            if (type == 'application/json') {
                $.map(result_metadata, function(item) {
                    metadataList.push({
                        'wikipageId' :  item.wikipageId,
                        'uri': item.uri,
                        'image': item.image,
                        'comment': item.comment
                    });
                });
                //Parse XML
            } else if (type == 'application/xml') {
                $(result_metadata).find('metadata').each(function() {
                    metadataList.push({
                        'wikipageId' :  $(this).find('wikipageId').text(),
                        'uri': $(this).find('uri').text(),
                        'image': $(this).find('image').text(),
                        'comment': $(this).find('comment').text()
                    });
                })
                metadataList.shift();
            }

            //criar o titulo das colunas
            var titles = '<tr><em>More info</em><th>wikipageId</th><th>URI</th> <th>Image</th> <th>Comment</th></tr>';

            //escreve as linhas na tabela
            var trHTML = '';
            $.each(metadataList, function (i, item) {
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
            if (type == 'application/json') {
                $.map(result_disease, function(item) {
                    relatedDiseasesList.push({
                        'dbpedia_disease_id': item.dbpedia_disease_id,
                        'description': item.description
                    });
                });
                //Parse XML
            } else if (type == 'application/xml') {
                $(result_disease).find('disease').each(function() {
                    relatedDiseasesList.push({
                        'dbpedia_disease_id': $(this).find('dbpedia_disease_id').text(),
                        'description': $(this).find('description').text()
                    });
                });
                relatedDiseasesList.shift();
            }

            //criar o titulo das colunas
            var titles = '<tr> <em>Related Diseases</em> <th>Id</th> <th>Disease Name</th></tr>';

            //escreve as linhas na tabela
            var trHTML = '';
            $.each(relatedDiseasesList, function (i, item) {
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

function increaseExpFeed(pubmed_id) {
    $.ajax({
        url: domain + articleResourceFeedbackIncrease + "/" + pubmed_id,
        data: {
            pubmed: pubmed_id,
            diseaseN: diseaseNameGlob,
            requestType: 'application/json'
        },
        method: "GET",
        success: function (result_for_feedback) {
            console.log("updated explicit feedback");
            /*$.each(result_for_feedback, function (i, item) {
                console.log("status updated!!!" + item);
            });*/
        }
    })
}

function decreaseExpFeed(pubmed_id) {
    $.ajax({
        url: domain + articleRescourceFeedbackDecrease + "/" + pubmed_id,
        data: {
            pubmed: pubmed_id,
            diseaseN: diseaseNameGlob,
            requestType: 'application/json'
        },
        method: "GET",
        success: function (result_for_feedback) {
            console.log("updated explicit feedback");
            /*$.each(result_for_feedback, function (i, item) {
                console.log("status updated!!!" + item);
            });*/
        }
    })
}

function goBack() {
    window.history.back();
}

//funçao de mudança de cor para não fazer click. Fica branco que não se vê alterações 
function changeColorUp(_this) {
    if (_this.style.backgroundColor !== "white"){
        _this.style.backgroundColor = "white";
    } else {
        alert("Just one vote!");
    }

}
function changeColorDown(_this) {
    if (_this.style.backgroundColor !== "white"){
        _this.style.backgroundColor = "white";
    } else {
        alert("Just one vote!");
    }

}

