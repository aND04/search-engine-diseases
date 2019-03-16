<?php
require "/home/aw002/public_html/search-engine-diseases/php/dbpedia_data_retrieval.php";

class PubmedData {

    var $dbPediaData;
    var $diseases;
    var $filename;
    var $command;

    const pathToFile = "resources/pubmed/";
    const txt = ".txt";
    const xml = ".xml";

    function __construct($term)
    {
        $this->dbPediaData = new DbPediaData($term);
        $this->dbPediaData->saveParsedContentToFile();
        $this->diseases = explode(",", $this->dbPediaData->getFileContents());
        $this->filename = self::pathToFile . $this->dbPediaData->term . self::xml;
    }

    function saveDiseasesToFile() {
        passthru("rm -f " . $this->filename);
        foreach ($this->diseases as $disease) {
            if (strlen($disease) > 0) {
                $disease = str_replace(" ", "%20", $disease);
                $command = "curl \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=" . $disease . "&retmax=10&retmode=xml\" | xmllint --xpath \"//Id\" - >> " . $this->filename;
                passthru($command);
            }
        }
    }

    function getFileContents() {
        return preg_split('"<Id>|<\/Id><Id>|<\/Id>"', file_get_contents($this->filename));
    }

    function getPubmedTitle($id) {
        $pubmedUrl = "https://www.ncbi.nlm.nih.gov/pubmed/" . $id;
        return $pubmedUrl;
    }
}