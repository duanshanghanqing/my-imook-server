//创建recruit表
/*
title：职位
company：公司名称
logo： logo
money：薪水
education：教育
year：工作年限
keyword：技术关键字
position：位置
industry：行业
introduction:公司简介
duty：工作职责
*/
exports.create_recruit =  `
    create table recruit(
        id int unsigned not null auto_increment,
        title varchar(20) not null,
        company varchar(20) not null,
        logo varchar(200) default null,
        money varchar(20) default null,
        education varchar(20) default null,
        year varchar(20) default null,
        keyword varchar(100) default null,
        position varchar(100) default null,
        industry varchar(100) default null,
        introduction varchar(200) default null,
        duty varchar(200) default null,
        primary key(id)
    )engine=InnoDB character set=utf8 comment='招聘职位表';
`
