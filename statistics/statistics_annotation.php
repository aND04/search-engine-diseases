<html>
    <head>
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
    </head>

    <body>
        <h1>Statistics - Demo II</h1>
        <form action='statistics_annotation.php' method='get'>
            <p> Disease: <input type='text' name='disease' /> </p>
            <p><input type='submit' value='Submit'/> </p>
        </form>
        <hr>

<?php
	include "config.php";

    if (!empty ($_GET)) {
         //Get disease id
         $disease = ucfirst($_GET['disease']);
         $sql = "SELECT id FROM dbpedia_disease WHERE description = '$disease'";
         $result = $conn->query($sql);
         $row = $result -> fetch_assoc();
         $diseaseId = $row["id"];
        if (mysqli_num_rows($result) == 0) {
            echo "Disease not found!";
        } else {
            //Articles and statistics
            $sql = "SELECT title, doidDisease,number_of_mentions, tfidf, similarity, explicitFeedbackValue, implicitFeedbackValue, date_Relevance, relevance_Avg
                    FROM pubmed_article_dbpedia_disease
            	    INNER JOIN pubmed_article on pubmed_article.id = pubmed_article_dbpedia_disease.pubmed_article_id
            	    INNER JOIN relevance on relevance.pubmed_article_id = pubmed_article.id and relevance.dbpedia_disease_id = pubmed_article_dbpedia_disease.dbpedia_disease_id
            	    INNER JOIN pubmed_article_dbpedia_disease_mentions on pubmed_article_dbpedia_disease_mentions.pubmed_article_id = pubmed_article.id and pubmed_article_dbpedia_disease_mentions.dbpedia_disease_id = pubmed_article_dbpedia_disease.dbpedia_disease_id
            	    WHERE pubmed_article_dbpedia_disease.dbpedia_disease_id = '$diseaseId'
            	    ORDER BY relevance_Avg desc";
            $result = $conn->query($sql);
            if (mysqli_num_rows($result) == 0) {
                echo "Articles not found!";
            } else {
                echo "<div style='overflow-x:auto;'>";
                echo "<table>";
                echo "<tr>";
                echo "<th>Article title</th>";
                echo "<th>DOID</th>";
                echo "<th>Number of mentions</th>";
                echo "<th>TFIDF</th>";
                echo "<th>Similarity</th>";
                echo "<th>Explicit feedback</th>";
                echo "<th>Implicit feedback</th>";
                echo "<th>Date relevance";
                echo "<th>Weighted average</th>";

                $rowArticles = array();
                while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
                	$rowArticles[] = $row;
                }
                foreach ($rowArticles as $article) {
                	echo "<tr>";
                	echo "<td>". base64_decode($article['title']) . "</td>";
                	echo "<td>". $article['doidDisease'] . "</td>";
                	echo "<td>". $article['number_of_mentions'] . "</td>";
                	echo "<td>". $article['tfidf'] . "</td>";
                	echo "<td>". $article['similarity'] . "</td>";
                	echo "<td>". $article['explicitFeedbackValue'] . "</td>";
                	echo "<td>". $article['implicitFeedbackValue'] . "</td>";
                	echo "<td>". $article['date_Relevance'] . "</td>";
                	echo "<td>". $article['relevance_Avg'] . "</td>";
                	echo "</tr>";
                }
                echo "</table>";
                echo "</div>";
            }
        }
    }

    $conn->close();
?>
    </body>
</html>