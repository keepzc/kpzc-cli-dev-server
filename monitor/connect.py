#your_accesskey_id: LTAI5tQWhW19jcYjKxHMB2Ch
#your_accesskey_secret: zGvZZrusB6x8knGjin9TtGnduS4Mpi
#your_default_project: kpzc_test
#your_end_point: http://service.cn-beijing.maxcompute.aliyun.com/api

from odps import ODPS
o = ODPS('LTAI5tQWhW19jcYjKxHMB2Ch', 'zGvZZrusB6x8knGjin9TtGnduS4Mpi', 'kpzc_test', endpoint='http://service.cn-beijing.maxcompute.aliyun.com/api')
import sys
import urllib
# for table in o.list_tables():
#   print(table)
# tab = o.get_table('kpzc_monitor')
# print(tab)
# with tab.open_reader() as reader:
#   for r in reader
#     print(r[0])
# data = [
#   [
#     "appid456", "pageid234", "66", "ua123", "http://www.baidu.com", '{"a":"5"}',"pv"
#   ]
# ]
# o.write_table(tab, data, partition='datetime=20230228')
# result = o.execute_sql('select * from kpzc_monitor where datetime="20230227"')

# with result.open_reader() as reader:
#  for record in reader:
#   print (record[0], record[1])

# INSERT INTO kpzc_test.kpzc_monitor 
# PARTITION (datetime = '20230228')
# VALUES ('appid123', 'pageid1234', '12344', 'ua123', 'http://www.baidu.com', '{"a": 2}', 'PV')

#insertSql = 'INSERT INTO kpzc_test.kpzc_monitor PARTITION (datetime = "20230228") VALUES ("appid456", "pageid234", "8887", "ua123", "http://www.baidu.com", \'{"a":"4"}\',"pv")'

insertSql = urllib.parse.unquote(sys.argv[1])
print(insertSql) # url decode

o.execute_sql(insertSql)
