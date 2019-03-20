create table twitter_tweet
(
  id          bigint(20)    not null auto_increment,
  tweet_id    varchar(255)  not null,
  url         varchar(255)  not null,
  description varchar(255)  not null,
  tweet_date  varchar(255)  not null,
  created_at  timestamp     not null default current_timestamp,
  updated_at  timestamp,
  disease_id  bigint(20)    not null,
  primary key (id),
  unique key uk_tweet_id (tweet_id),
  constraint fk_tweet_disease foreign key (disease_id) references dbpedia_disease(id)
);
