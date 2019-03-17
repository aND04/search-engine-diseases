<?php
require "/home/aw002/public_html/search-engine-diseases/php/dbpedia_data_retrieval.php";

class PubmedData {

    var $dbPediaData;
    var $diseases;
    var $filename;
    var $command;
    var $pathToArticlesFiles;

    var $diseaseTitleAbstractMap = array();

    const pathToFile = "resources/pubmed/";
    const txt = ".txt";
    const xml = ".xml";

    function __construct($term)
    {
        $this->dbPediaData = new DbPediaData($term);
        $this->dbPediaData->saveParsedContentToFile();
        $this->diseases = explode(",", $this->dbPediaData->getFileContents());
        $this->diseases = str_replace(" ", "%20", $this->diseases);
        $this->filename = self::pathToFile . $this->dbPediaData->term . self::xml;
        $this->pathToArticlesFiles = self::pathToFile . $this->dbPediaData->term . '/';
    }

    function retrieveAbstractAndTitle($disease) {
        $file = simplexml_load_file($this->pathToArticlesFiles . $disease . '_articles' . self::xml);
        $title = $file->xpath('//ArticleTitle/text()');
        $abstracts = $file->xpath('//AbstractText/text()');
        /*echo '<pre>title</pre>';
        echo '<pre>' . print_r($title) . '</pre>';
        echo '<pre>abstract</pre>';
        echo '<pre>' . print_r($abstracts) . '</pre>';*/
        echo '<pre>' . $disease . '</pre>';
        $this->diseaseTitleAbstractMap[$disease] = array($title, $abstracts);
        print_r($this->diseaseTitleAbstractMap[$disease]);
    }

    function saveArticlesOfDiseaseToFile($diseaseArticleIdsFile, $disease) {
        $diseaseArticlesFile = $this->pathToArticlesFiles . $disease . '_articles' . self::xml;
        $ids = trim(preg_replace('"<Id>|<\/Id><Id>|<\/Id>"', ",", file_get_contents($diseaseArticleIdsFile)), ",");
        $command = "curl \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=" . $ids . "&retmode=text&rettype=xml\" > " . $diseaseArticlesFile;
        passthru($command);
    }

    function saveDiseasesToFile() {
        if (!is_dir($this->pathToArticlesFiles))
            passthru("mkdir -p " . $this->pathToArticlesFiles);
        foreach ($this->diseases as $disease) {
            echo '<pre>' . $disease . '</pre>';
            if (strlen($disease) > 0) {
                $diseaseArticleIdsFile = $this->pathToArticlesFiles . $disease . self::xml;
                $command = "curl \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=" . $disease . "&retmax=10&retmode=xml\" | xmllint --xpath \"//Id\" - > " . $diseaseArticleIdsFile;
                passthru($command);
                $this->saveArticlesOfDiseaseToFile($diseaseArticleIdsFile, $disease);
                $this->retrieveAbstractAndTitle($disease);
            }
        }
        echo '<pre>' . print_r($this->diseaseTitleAbstractMap) . '</pre>';
    }
}