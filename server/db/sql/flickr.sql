create table flickr_photo
(
  id          bigint(20)    not null auto_increment,
  flickr_id   bigint(20)    not null,
  url         varchar(255)  not null,
  title       varchar(255)  not null,
  created_at  timestamp     not null default current_timestamp,
  updated_at  timestamp,
  primary key (id),
  unique key uk_flickr_id (flickr_id)
);

create table flickr_photo_dbpedia_disease
(
  flickr_photo_id     bigint(20)  not null,
  dbpedia_disease_id  bigint(20)  not null,
  primary key (flickr_photo_id, dbpedia_disease_id),
  constraint fk_flickr_photo_dbpedia_disease_flickr_photo_id     foreign key (flickr_photo_id)     references flickr_photo(id),
  constraint fk_flickr_photo_dbpedia_disease_dbpedia_disease_id  foreign key (dbpedia_disease_id)  references dbpedia_disease(id)
);
