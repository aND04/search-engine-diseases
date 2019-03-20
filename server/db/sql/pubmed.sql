create table pubmed_article
(
  id          bigint(20)    not null auto_increment,
  pubmed_id   bigint(20)    not null,
  title       varchar(255)  not null,
  abstract    varchar(255)  not null,
  created_at  timestamp     not null default current_timestamp,
  updated_at  timestamp,
  disease_id  bigint(20)    not null,
  primary key (id),
  unique key uk_pubmed_id (pubmed_id),
  constraint fk_article_disease foreign key (disease_id) references dbpedia_disease(id)
);
