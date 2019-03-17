<div class="card padding-2">
    <div class="row">
        <?php
        require "/home/aw002/public_html/search-engine-diseases/php/pubmed_data_retrieval.php";

        $pubmed = new PubmedData($_GET['medical-specialty']);
        $pubmed->saveDiseasesToFile();
        /*echo '<pre>' . print_r($pubmed->diseaseTitleAbstractMap) . '</pre>';*/
        ?>
    </div>
</div>