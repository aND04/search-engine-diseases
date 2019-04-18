create table pubmed_article
(
  id          bigint(20)      not null auto_increment,
  pubmed_id   bigint(20)      not null,
  title       varchar(5000)    not null,
  abstract    varchar(10000)  not null,
  created_at  timestamp       not null default current_timestamp,
  updated_at  timestamp,
  primary key (id),
  unique key uk_pubmed_id (pubmed_id)
);

create table pubmed_article_dbpedia_disease
(
  pubmed_article_id   bigint(20)  not null,
  dbpedia_disease_id  bigint(20)  not null,
  primary key (pubmed_article_id, dbpedia_disease_id),
  constraint fk_pubmed_article_dbpedia_disease_pubmed_article_id          foreign key (pubmed_article_id)   references pubmed_article(id),
  constraint fk_pubmed_article_dbpedia_disease_pubmed_dbpedia_disease_id  foreign key (dbpedia_disease_id)  references dbpedia_disease(id)
);
