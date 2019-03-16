<?php

class DbPediaData {

    var $term;
    var $filename;
    var $command;
    var $didContentChange;
    const pathToFile = "resources/dbpedia/";
    const ext = ".txt";

    function __construct($term)
    {
        $term = ucfirst($term);
        $this->term = $term;
        $this->filename = self::pathToFile . $term . self::ext;
        $this->command = "curl \"http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Furi+%3Fname+where+%7B%0D%0A+%3Furi+a+dbo%3ADisease+.%0D%0A+%3Furi+dbp%3Afield+dbr%3A" . $term . "+.%0D%0A+%3Furi+foaf%3Aname+%3Fname%0D%0A%7D+LIMIT+10&format=text%2Fhtml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+\" | xmllint --xpath \"//td/pre/text()\" - > " . $this->filename;
    }

    function saveParsedContentToFile() {
        $oldContent = $this->getFileContents();
        passthru($this->command);
        $file = $this->getFileContents();
        $result = '';
        foreach (preg_split("\"@en\"", $file) as $expr) {
            if (strlen($expr) > 0) {
                $result .= str_replace("\"", "", explode("@en", $expr)[0]) . ",";
            }
        }
        $this->isContentDifferent($oldContent, $result);
        file_put_contents($this->filename, $result);
    }

    function getFileContents() {
        return file_get_contents($this->filename);
    }

    function isContentDifferent($fileContent, $newContent) {
        $this->didContentChange =  $fileContent !== $newContent;
    }
}