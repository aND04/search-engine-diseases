<div class="card padding-2">
    <div class="row">
        <?php
        $term = $_GET['medical-specialty'];
        $term = ucfirst($term);
        $command = "curl \"http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Furi+%3Fname+where+%7B%0D%0A+%3Furi+a+dbo%3ADisease+.%0D%0A+%3Furi+dbp%3Afield+dbr%3A" . $term . "+.%0D%0A+%3Furi+foaf%3Aname+%3Fname%0D%0A%7D+LIMIT+10&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+\" > resources/dbpedia/" . $term . ".txt";
        passthru($command);
        echo $command;
        ?>
    </div>
</div>