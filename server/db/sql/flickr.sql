create table flickr_photo
(
  id          bigint(20)    not null auto_increment,
  flickr_id   bigint(20)    not null,
  url         varchar(255)  not null,
  created_at  timestamp     not null default current_timestamp,
  updated_at  timestamp,
  disease_id  bigint(20)    not null,
  primary key (id),
  unique key uk_flickr_id (flickr_id),
  constraint fk_photo_disease foreign key (disease_id) references dbpedia_disease(id)
);
