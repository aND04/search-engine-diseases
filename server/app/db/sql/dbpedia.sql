create table dbpedia_medical_specialty
(
  id                bigint(20)    not null auto_increment,
  description       varchar(100)  not null,
  created_at        timestamp     not null default current_timestamp,
  updated_at        timestamp,
  primary key (id),
  unique key UK_description (description)
);

create table dbpedia_disease
(
  id                    bigint(20)    not null auto_increment,
  description           varchar(100)  not null,
  created_at            timestamp     not null default current_timestamp,
  updated_at            timestamp,
  medical_specialty_id  bigint(20)    not null,
  primary key (id),
  unique key UK_description (description),
  constraint fk_specialty_disease foreign key (medical_specialty_id) references dbpedia_medical_specialty(id)
);

create table dbpedia_metadata_disease
(
    id           bigint(20) not null auto_increment,
    wikipageId   bigint(20)       not null,
    uri          varchar(255) not null,
    diseaseName  varchar(255) not null,
    image        varchar(255) not null,
    comment   varchar(255) not null,
    created_at  timestamp     not null default current_timestamp,
    updated_at  timestamp,
    primary key (id)
);

create table dbpedia_metadata_dbpedia_medical_specialty
(
    dbpedia_metadata_id bigint(20) not null,
    dbpedia_medical_specialty_id  bigint(20) not null,
    primary key (dbpedia_metadata_id, dbpedia_medical_specialty_id),
    constraint fk_dbpedia_metadata_dbpedia_disease_dbpedia_medical_specialty_id   foreign key (dbpedia_medical_specialty_id) references dbpedia_medical_specialty (id),
    constraint fk_dbpedia_metadata_dbpedia_disease_dpedia_metadata_id   foreign key (dbpedia_metadata_id) references dbpedia_metadata_disease (id)
);
