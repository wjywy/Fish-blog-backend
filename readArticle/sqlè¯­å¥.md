<a name="EIp8n"></a>
# 增加
```sql
insert into 表名(字段名) values (?,?)  --问号代表变量
```
<a name="rDC8R"></a>
# 删除
```sql
-- 删除表中特定字段的值
delete from 表名 where 字段名=? and 字段名=? --问号代表变量

-- 删除表中id值为12到17的数据
delete from 表名 where id between 12 and 17

-- 删除表中大于10的数据
delete from 表名 where 字段值>10
```
<a name="BAJzB"></a>
# 更新
```sql
-- 将id为?的字段名1改为?，字段名2改为?
update 表名 set 字段名1=?,sex=? where id=?

--将id值为?-?的字段名1改为? 
update 表名 set 字段名1=? where id between ? and ?
```
<a name="VeFNo"></a>
# 查询
```sql
-- 查询表中所有列所有数据
select * from stu

-- 指定字段列表进行查询
select id, name, age, sex from 表名

-- where条件查询
-- 可以在where子句中指定任何条件
-- 可以使用and或者or指定一个或多个条件
-- where条件也可以运用在update和delete语句的后面
-- where子句类似程序语言中if条件，根据mysql表中的字段值来进行数据的过滤

-- 查询表名中字段名大于22的数据
select * from 表名 where 字段名>22

-- 查询表名中name=某个条件值的数据
select * from 表名 where 字段名=?

-- 查询表中年龄在?到?之间的数据
select * from 表名 where age between ? and ?

-- 查询表中年龄不在?到?之间的数据
select * from 表名 where age not between ? and ?

-- 查询表中年龄在?到?之间的女生的信息
select * from 表名 where age between ? and ? and sex='女'

-- and优先级大于or的优先级
-- 我们可以使用小括号来关联我们的语句
select * from 表名 where (age=22 or age=25) and sex='女'

-- like子句，可以使用like语句进行某个字段的模糊搜索
-- 使用%模糊搜索。%代表任意个任意字符

-- 查询name字段中包含x的
select * from stu where name like '%x%'

-- 查询name字段中最后一个字符为u的
select * from stu where name like '%u'

-- 查询name字段中第一个字符为q的
select* from stu where name like 'q%'

-- 使用_单个的下划线。表示一个任意字符，使用和%类似

-- 查询表中name字段为两个字符的数据
select * from users where name like '__'

-- 查询name字段最后为j，的两个字符的数据
select * from users where name like '_j'

-- 注意：where子句中的like在使用%或者_进行模糊搜索时，效率不高，使用时注意：
    -- 尽可能的不去使用%或者_
    -- 如果需要使用，也尽可能不要把通配符方法开头处

-- mysql中的统计函数(聚合函数)
-- 可以使用like语句进行某个字段的模糊搜索
```
