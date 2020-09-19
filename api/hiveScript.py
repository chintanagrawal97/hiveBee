import gzip , re , time , os 
import click
import hiveMain

SPECIFIC_ERROR_L=[]
SPECIFIC_WARN_L=[]
JSON_ARRAY = []
JSON_KEY = []

@click.command()
@click.option('--cluster_id', help="Hive ClusterId", type=str)
@click.option('--query_id', help="Hive QueryId", type=str)
@click.option('--keyword', help="Keyword for search", type=str)
@click.option('--location', help="Log Locations", type=str)
@click.option('--exclusive', help="Exclusive", type=str)
def MainProg(cluster_id,query_id,keyword,location,exclusive):
    if cluster_id is None or query_id is None or location is None: 
        raise Exception("cluster_id , query_id & location are mandatory arguments. Refer to --help for more details.")
    
    res = hiveMain.lambda_handler(clusterId,queryId,keyword,location,exclusive)

    return res
  
if __name__=="__main__": 
    MainProg()     

