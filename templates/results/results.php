<div class="card padding-2">
    <div class="row">
        <?php
        require "/home/aw002/public_html/search-engine-diseases/php/pubmed_data_retrieval.php";

        $pubmed = new PubmedData($_GET['medical-specialty']);
        $pubmed->saveDiseasesToFile();
        foreach ($pubmed->getFileContents() as $id) {
            if (strlen($id) > 0) {
                $url = $pubmed->getPubmedTitle($id);
                echo '<pre><a href="' . $url . '">' . $url . '</a></pre>';
            }
        }
        ?>
    </div>
</div>