<div class="card padding-2">
    <div class="row">
        <?php
        require "/home/aw002/public_html/search-engine-diseases/php/dbpedia_data_retrieval.php";

        $dbPediaData = new DbPediaData($_GET['medical-specialty']);
        $dbPediaData->saveParsedContentToFile();
        echo $dbPediaData->getFileContents();
        echo '<pre>' . $dbPediaData->didContentChange . '</pre>';
        ?>
    </div>
</div>