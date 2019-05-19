<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="js/materialize.js"></script>
				<style>
		    		table, th, td {
		    		    border-collapse: collapse;
		                border-spacing: 0;
		                width: 100%;
		    		    border: 1px solid black;
		    		}

		    		th, td {
		    		    text-align: center;
		    			border: 1px solid black;
		    			padding: 8px;
		    		}
        </style>
				<script>
					$(document).ready(function(){
							$('#api-content').append(html);
							$('.tabs').tabs();
					})
				</script>
		</head>
		<body class="grey lighten-5">
				<header>
						<div class="row">
								<div class="col s12">
									<ul class="tabs">
										<li class="tab col s3"><a target="_self" href="index.html">API</a></li>
										<li class="tab col s3"><a href="statistics_retrieval.php">Statistics Demo 1</a></li>
										<li class="tab col s3"><a target="_self" class="active" href="statistics_annotation.php">Statistics Demo 2</a></li>
									</ul>
								</div>
						</div>
				</header>
				<main>
					<h1>Statistics - Demo I</h1>
				    <form action='statistics_retrieval.php' method='get'>
		            <p> Specialty: <input type='text' name='specialty' /> </p>
		            <p><input type='submit' value='Submit'/> </p>
		        </form>
				    <hr>
<?php
include "config.php";

//Get specialty ID
$specialty = isset($_GET['specialty']) ? $_GET['specialty'] : '';
$sql = "SELECT id FROM dbpedia_medical_specialty WHERE description = '$specialty'";
$result = $conn->query($sql);
$row = $result -> fetch_assoc();
$idSpecialty = $row["id"];

//Number of diseases
$sql = "SELECT COUNT(*) AS total FROM dbpedia_disease WHERE medical_specialty_id = '$idSpecialty'";
$result = $conn->query($sql);
$row = $result -> fetch_assoc();
echo "Number of diseases: ". $row['total']. "<br>";

//Number of articles
$sql = "SELECT COUNT(*) AS total FROM pubmed_article INNER JOIN pubmed_article_dbpedia_disease padd ON pubmed_article.id = padd.pubmed_article_id, dbpedia_disease disease WHERE disease.medical_specialty_id = '$idSpecialty' AND disease.id = padd.dbpedia_disease_id";
$result = $conn->query($sql);
$row = $result -> fetch_assoc();
echo "Number of articles: ". $row['total']. "<br>";

//Number of flickr photos
$sql = "SELECT COUNT(fp.flickr_id) AS total FROM flickr_photo fp INNER JOIN flickr_photo_dbpedia_disease fpdd ON fp.id = fpdd.flickr_photo_id INNER JOIN dbpedia_disease dd ON fpdd.dbpedia_disease_id = dd.id INNER JOIN dbpedia_medical_specialty dms ON dd.medical_specialty_id = dms.id WHERE dms.description = '$specialty'";
$result = $conn->query($sql);
$row = $result -> fetch_assoc();
echo "Number of flickr photos: ". $row['total']. "<br>";

//Number of tweets
$sql = "SELECT COUNT(DISTINCT t.id) AS total FROM twitter_tweet t INNER JOIN twitter_tweet_dbpedia_disease ttdd ON t.id = ttdd.twitter_tweet_id INNER JOIN dbpedia_disease dd ON ttdd.dbpedia_disease_id = dd.id INNER JOIN dbpedia_medical_specialty dms ON dd.medical_specialty_id = dms.id WHERE dms.description = '$specialty'";
$result = $conn->query($sql);
$row = $result -> fetch_assoc();
echo "Number of tweets: ". $row['total']. "<br>";

$conn->close();
?>
</main>
</body>
</html>
