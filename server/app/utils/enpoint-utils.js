const dbPediaEndpoint = function (medicalSpecialty) {
    return `http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Furi+%3Fname+where+%7B%0D%0A+%3Furi+a+dbo%3ADisease+.%0D%0A+%3Furi+dbp%3Afield+dbr%3A${medicalSpecialty}+.%0D%0A+%3Furi+foaf%3Aname+%3Fname%0D%0A%7D+LIMIT+10&format=text%2Fxml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+\\`;
};

const dbPediaMetaEndpoint = function (medicalSpecialty) {
    return `http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Furi+%3FdiseaseName+%3Fimage+%3FdiseaseField+%3FwikipageId+%3FdeathName+where+%7B%0D%0A+%3Furi+a+dbo%3ADisease+.%0D%0A+%3Furi+dbp%3Afield+dbr%3A${medicalSpecialty}.%0D%0A+%3Furi+foaf%3Aname+%3FdiseaseName.%0D%0A+%3Furi+foaf%3Adepiction+%3Fimage.%0D%0A+%3Furi+dbp%3Afield+%3FdiseaseField.%0D%0A+%3Furi+dbo%3AwikiPageID+%3FwikipageId.%0D%0A+%3Fdeath+dbo%3AdeathCause+%3Furi+.%0D%0A+%3Fdeath+foaf%3Aname+%3FdeathName%0D%0A%7D&format=text%2Fxml&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+\\`;
};

const pubmedArticleIdsEndpoint = function (disease) {
    return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${disease}&retmax=10&retmode=xml`;
};

const pubmedArticleEndpoint = function (ids) {
    return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids}&retmode=text&rettype=xml`;
};

const flickrEndpoint = function (disease) {
    return `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2508b7cca5ebc9f8b29f9426e45e05a3&text=${disease}&per_page=10&privacy_filter=1`;
};

const merEndpoint = function (text) {
    return `http://labs.rd.ciencias.ulisboa.pt/mer/api.php?lexicon=doid&text=${text}`;
};

module.exports = {
    dbpedia: dbPediaEndpoint,
    dbpediaMeta: dbPediaMetaEndpoint,
    pubmedArticleIds: pubmedArticleIdsEndpoint,
    pubmedArticle: pubmedArticleEndpoint,
    flickrEndpoint: flickrEndpoint,
    merEndpoint: merEndpoint
};
