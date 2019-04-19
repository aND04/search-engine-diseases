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
    diseaseId  bigint(20) not null,
    wikipageId   bigint(20)       not null,
    uri          varchar(255) not null,
    image        varchar(255) not null,
    comment   varchar(255) not null,
    created_at  timestamp     not null default current_timestamp,
    updated_at  timestamp,
    primary key (id),
    unique key UK_wikipageId (wikipageId),
    constraint fk_disease_metadata foreign key (diseaseId) references dbpedia_disease(id)
);
