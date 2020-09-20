import gzip , re , time , os 
import click
import hiveMain
from flask import jsonify 
SPECIFIC_ERROR_L=[]
SPECIFIC_WARN_L=[]
JSON_ARRAY = []
JSON_KEY = []

# @click.command()
# @click.option('--cluster_id', help="Hive ClusterId", type=str)
# @click.option('--query_id', help="Hive QueryId", type=str)
# @click.option('--keyword', help="Keyword for search", type=str)
# @click.option('--location', help="Log Locations", type=str)
# @click.option('--exclusive', help="Exclusive", type=str)
# def MainProg(cluster_id,query_id,keyword,location,exclusive):
#     if cluster_id is None or location is None: 
#         raise Exception("cluster_id  & location are mandatory arguments. Refer to --help for more details.")
    
#     res = hiveMain.lambda_handler(cluster_id,query_id,keyword,location,exclusive)
#     print(res)
#     return res

def MainProg(CLUSTER_ID,QUERY_ID,KEYWORD,LOCATION,EXCLUSIVE):
    res = hiveMain.lambda_handler(CLUSTER_ID,QUERY_ID,KEYWORD,LOCATION,EXCLUSIVE)
    jsonResp = {'jack': 4098, 'sape': 4139}
    return res

if __name__=="__main__": 
    MainProg()     


