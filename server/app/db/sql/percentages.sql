create table weighted_average_percentages
(
    id          bigint(20)    not null auto_increment,
    tfidfPer            float(2, 2) not null,
    pubDatePer          float(2, 2) not null,
    similarityPer       float(2, 2) not null,
    explicitFeedbackPer float(2, 2) not null,
    implicitFeedbackPer float(2, 2) not null,
     primary key (id)
);
