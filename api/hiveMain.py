#importing libraries
import time , sys , os , gzip , json
from hiveHelper import get_app_logs , get_query_logs
from hiveHelper import get_app_ids, get_query_paths, get_master_id
from hiveHelper import get_specific_errors, get_specific_warnings



def lambda_handler(CLUSTER_ID,QUERY_ID,KEYWORD,LOCATION,EXCLUSIVE):
    #Getting inputs - cluster id and keywords
    all_logs = {}
    files_in_dir = []
    hive_log_paths = []
    app_log_paths = []
    cluster_id= CLUSTER_ID
    keyword = KEYWORD
    location = str(str(LOCATION)+'/'+str(cluster_id))
    master_id = get_master_id(cluster_id, location)



    for r, d, f in os.walk(location):
        for item in f:
            if '.gz' in item:
                files_in_dir.append(os.path.join(r, item))
                path = os.path.join(r, item)
                if '/containers/' in path:
                    app_log_paths.append(path)
                elif str('/node/'+str(master_id)+'/applications/hive/') in path:
                    hive_log_paths.append(path)

    
    #Keyword query logs and keyword app logs store the keyword logs of hive logs and app logs
    keyword_query_logs = []
    keyword_app_logs = []
    
    #Getting all query logs for the cluster id
    all_logs['ErrorsInHiveLogs'],keyword_query_logs = get_query_logs(cluster_id,keyword,hive_log_paths)

    
    #Checking if cluster id is valid and displaying all query ids used in it
    if (all_logs['ErrorsInHiveLogs']) == {}:

        return{'body':''}

    else:

            
        #taking query id input (optional)
        chosen_query_id= QUERY_ID
        
        #if query id is not given, retrieving logs of all queries
        if chosen_query_id == "":
            
            #Defining result dictionary
            res = {}
            res["app_ids_found"] = []
            res["logs"] = []
            
            #Getting the log location paths of all queries
            query_paths = get_query_paths()
            
            #Keyword queries is a temporary list of all logs containing the keyword
            keyword_queries = []
            d = {}
            
            #keyword is given and query id is not given => only keyword logs
            #keyword is not given and query id is not given => only query logs
            #Storing all query logs in res['logs'] list
            if keyword == "":
                for i in all_logs['ErrorsInHiveLogs'].keys():
                    d = {}
                    d[i] = all_logs['ErrorsInHiveLogs'][i]
                    d[i]["path"] = query_paths[i]
                    res["logs"].append(d)
                    
            #Storing all the keyword query results in res['keyword_queries'] list
            d = {}
            for i in keyword_query_logs.keys():
                d = {}
                qid = str(i).split('-->')[1]
                if (str(i).split('-->')[1]) =="none":
                    d[i] = keyword_query_logs[i]
                elif str(i).split('-->')[-1] == 'INFO':
                    d[qid+"--->"+str(str(i).split('-->')[-1])] = keyword_query_logs[i]
                else:
                    d[qid+"--->"+str(str(i).split('-->')[-1])] = all_logs['ErrorsInHiveLogs'][str(i).split("-->")[1]][str(i).split('-->')[2]]
                keyword_queries.append(d)
            res['keyword_queries'] = keyword_queries
            
            #Getting specific errors and specific warnings list
            res['specific_errors'] = get_specific_errors(res["logs"])
            res['specific_warnings'] = get_specific_warnings(res["logs"])
            res['memory'] = []
            res['query_path'] = ''
            res['KeywordLen'] = len(str(res['keyword_queries']))
            res['resLen'] = len(str(res)) - res['KeywordLen']
            res["flag"] = 0
            
            #json files for final result and keyword result 
            json_file = json.dumps(res,indent=4,sort_keys=True)
            keyword_file = json.dumps(res['keyword_queries'], indent=4, sort_keys=True)

            if len(str(res['keyword_queries']))>135000000:
                try:
                    file_name = str(cluster_id)+'_'+str(chosen_query_id)+'.json'
                    file_loc = str(location)+'/'+str(file_name)
                    fr = open(file_loc,"w")
                    fr.write(keyword_file)
                    fr.close()
                    res['memory'] = [file_loc]
                   
                except:
                    res['memory'] = ["Exception - Failed to write to file"]
                res['keyword_queries'] = []
                res['flag'] = 1
                res['KeywordLen'] = len(str(res['keyword_queries']))

            #returning the final result
            return json_file

        #if query id is invalid, returning no results
        elif chosen_query_id not in all_logs['ErrorsInHiveLogs'].keys():
            return {''}


        #if query id is given and valid, getting all query logs and application logs associated with it
        else:
            #Defining result dicationaries and other temporary variables
            app_logs = []
            keyword_queries = []
            res = {}
            res["app_ids_found"] = []
            res["logs"] = []
            temp = {}
            
            #Getting application ids of the given query id
            app_ids_in_query= get_app_ids(cluster_id, chosen_query_id, hive_log_paths)
            
            
            #Getting logs of all application ids associated with the query id
            for items in app_ids_in_query:
            
                res["app_ids_found"].append(items)
                app_logs, l = get_app_logs(cluster_id, items, keyword, app_log_paths)
                for i in l.keys():
                    keyword_queries.append({i:l[i]})
                temp.update(app_logs[items])
                
            #For a query id , get hive.log errors and app_id errors 
            result = {}
            query_paths = get_query_paths()
            res["query_path"] = query_paths[chosen_query_id]
            temp[chosen_query_id] = (all_logs['ErrorsInHiveLogs'][chosen_query_id])

            #storing all query logs and the application logs in res['logs'] list
            d = {}
            for i in temp.keys():
                d = {}
                d[i] = temp[i]
                res['logs'].append(d)
                
            #Storing all the keyword query results in res['keyword_queries'] list
            d = {}
            for i in keyword_query_logs.keys():
                d = {}
                qid = str(i).split('-->')[1]
                if qid == chosen_query_id:
                    if str(i).split('-->')[-1] == 'INFO':
                        d[str(qid)+"--->"+str(str(i).split('-->')[-1])] = keyword_query_logs[i]
                    else:
                        d[str(qid)+"--->"+str(str(i).split('-->')[-1])] = all_logs['ErrorsInHiveLogs'][str(i).split("-->")[1]][str(i).split('-->')[2]]
                    keyword_queries.append(d)
            res['keyword_queries'] = keyword_queries
            
            #Getting specific errors and specific warnings list
            res['specific_errors'] = get_specific_errors(res["logs"])
            res['specific_warnings'] = get_specific_warnings(res["logs"])
            res['memory'] = []
            res['KeywordLen'] = len(str(res['keyword_queries']))
            res['resLen'] = len(str(res)) - res['KeywordLen']
            res["flag"] = 0

            #json files for final result and keyword result 
            json_file = json.dumps(res,indent=4,sort_keys=True)
            keyword_file = json.dumps(res['keyword_queries'], indent=4, sort_keys=True)

            if len(str(res['keyword_queries']))>135000000:
                try:
                    file_name = str(cluster_id)+'_'+str(chosen_query_id)+'.json'
                    file_loc = str(location)+'/'+str(file_name)
                    fr = open(file_loc,"w")
                    fr.write(keyword_file)
                    fr.close()
                    res['memory'] = [file_loc]
                   
                except:
                    res['memory'] = ["Exception - Failed to write to file"]
                res['keyword_queries'] = []
                res['flag'] = 1
                res['KeywordLen'] = len(str(res['keyword_queries']))
            
            #returning final result
            return json_file
    
