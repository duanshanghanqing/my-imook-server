//创建user表
const create_user = `
create table user(
    id int unsigned not null auto_increment,
    name varchar(20) default null,
    age tinyint(2) zerofill default null,
    nick char(20) default null,
    sex enum('男','女') default null,
    phone varchar(11) default null, 
    email varchar(20) default null,  
    password varchar(200) default null,
    create_time int(20) default null,
    modified_time int(20) default null,
    role varchar(20) default null,
    portrait varchar(200) default null,
    unique (name),
    primary key(id)
)engine=InnoDB character set=utf8 comment='用户信息表';
`;
/*
id int(2) unsigned zerofill not null auto_increment。其实显示宽度只有1位，因为数字有个 + 的符号位被占用
(2)：查询时显示的宽度，不足2位时补0，必须加zerofill 关键字才要意义
zerofill:使不足3位的为数用0代替
unsigned: 无符号，不能存负数
auto_increment: 设置自增
primary key(id): 设置主键位id列
primary key(id,name):设置复合主键
alter table drop primary key:删除主键
添加唯一约束
[name varchar(20) not null unique] unique:表示该name字段不能重复
alter table user add constraint uk unique (name);表建立以后，给相关字段添加唯一约束name字段
alter table user drop index name;:删除唯一约束nema字段
AUTO_INCREMENT=100: 从100开始
engine=InnoDB: 指定引擎
character set=utf8: 设置编码
show create table user;:  查看创建表的的语句
enum('男','女')：枚举类型，只能是男和女，不填是null
*/
const insert_user = `
insert into user(
    name,
    age,
    nick,
    sex,
    phone,
    email,
    password,
    create_time,
    modified_time,
    role,
    portrait
) values (?,?,?,?,?,?,?,?,?,?,?);
`;

const update_user = `update user set name=? where id>?;`;

const select_user = `select * from user where id>? and id<?;`;

module.exports = {
    create_user,
    insert_user,
    update_user,
    select_user
}