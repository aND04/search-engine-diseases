create table twitter_tweet
(
  id          bigint(20)    not null auto_increment,
  tweet_id    varchar(255)  not null,
  url         varchar(255)  not null,
  description varchar(5000) not null,
  tweet_date  varchar(255)  not null,
  created_at  timestamp     not null default current_timestamp,
  updated_at  timestamp,
  primary key (id),
  unique key uk_tweet_id (tweet_id)
);

create table twitter_tweet_dbpedia_disease
(
  twitter_tweet_id    bigint(20)  not null,
  dbpedia_disease_id  bigint(20)  not null,
  primary key (twitter_tweet_id, dbpedia_disease_id),
  constraint fk_twitter_tweet_dbpedia_disease_flickr_photo_id     foreign key (twitter_tweet_id)    references twitter_tweet(id),
  constraint fk_twitter_tweet_dbpedia_disease_dbpedia_disease_id  foreign key (dbpedia_disease_id)  references dbpedia_disease(id)
);
