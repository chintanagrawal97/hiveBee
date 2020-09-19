#importing files
import threading
import os
from io import BytesIO
import gzip
import time
import concurrent.futures
import json

#Defining global variables
query_paths = {}
query_logs = {}
error_logs = {}
app_ids=[]
keyword_query_logs = {}
keyword_app_logs = {}


#Function to find master_id
def get_master_id(cluster_id, location):
    master_id = ''
    files_in_dir = []
    for r, d, f in os.walk(location):
        for item in f:
            if '.gz' in item:
                files_in_dir.append(os.path.join(r, item))
                path = os.path.join(r, item)
                if '/applications/hadoop-yarn/yarn-yarn-resourcemanager' in str(path):
                    master_id = path.split('/')[-4]
            if master_id != '':
                break
        if master_id != '':
                break
    return master_id

    

#Function for finding errors in hive logs from file in the given file path
def FindErrorInQuery(file_path, keyword):
    #global variables
    global query_logs
    global keyword_query_logs

    try:
        #reading data from file and storing in a list
        with gzip.open(file_path, 'rb') as f:
            filedata = f.read()
        data = filedata.decode('utf-8')
        data_list = data.split('\n')

        #Defining local variables and flags
        found = False
        found_error = False
        found_query = False
        flag = ""
        query_id = "none"
        
        #Checking all logs and categorising as errors, warnings or info
        for line in data_list:
            if (str("Compiling command(queryId=") in line) and found==False:
                found = True
                query_id = line[line.find('queryId'):line.find('):')][8:]
                if query_id not in query_paths.keys():
                    query_paths[query_id] = str(file_path)
                if query_id not in query_logs.keys():
                    query_logs[query_id] = {}
                    query_logs[query_id]["ERROR"] = []
                    query_logs[query_id]["WARN"] = []
            if ((str("queryId=") in line) and str(query_id) not in line) and found == True:
                found=False
                query_id = line[line.find('queryId'):line.find('):')][8:]
                if query_id not in query_paths.keys():
                    query_paths[query_id] = str(file_path)
                if query_id not in query_logs.keys():
                    query_logs[query_id] = {}
                    query_logs[query_id]["ERROR"] = []
                    query_logs[query_id]["WARN"] = []
                found = True
            if found == True:
                if "ERROR" in line:
                    query_logs[query_id]["ERROR"].append(line)
                    flag = "ERROR"
                elif "WARN" in line:
                    query_logs[query_id]["WARN"].append(line)
                    flag = "WARN"
                elif "INFO" in line:
                    flag = "INFO"
                else:
                    if flag!='INFO':
                        query_logs[query_id][flag][-1] = str(query_logs[query_id][flag][-1])+str(line)
                        
            #Checking if the any keyword occured in the line and adding to keyword logs
            temp_line = ''
            k = ''
            if 'class path' in line or 'CLASSPATH' in line or 'classpath' in line:
                continue
            for key in keyword.split(','):
                if key.lower() in line.lower() and key != '':
                    k = str(file_path)+"-->"+str(query_id)+"-->"+flag
                    temp_line = line
                    if k not in keyword_query_logs.keys():
                        keyword_query_logs[k] = []
            if k != '':
                keyword_query_logs[k].append(temp_line)


    except Exception as e:
        pass

#Function to get application logs from file in the given file path
def FindErrorInContainer(file_path, keyword):
    #global variables
    global error_logs
    global keyword_app_logs

    try:
        #reading data from file and storing in a list
        with gzip.open(file_path, 'rb') as f:
            filedata = f.read()
        data = filedata.decode('utf-8')
        data_list = data.split('\n')

        #Defining local variables and flags
        application_id = file_path.split('/')[-3]
        container_id = file_path.split('/')[-2]
        flag = ""

        #Adding keys to the global dictionary for application logs
        if application_id not in error_logs.keys():
            error_logs[application_id] = {}
        if container_id not in error_logs[application_id].keys():
            error_logs[application_id][container_id] = {}
            error_logs[application_id][container_id]['ERROR'] = []
            error_logs[application_id][container_id]['WARN'] = []
            
        #Checking all logs and categorising as errors, warnings or info
        for line in data_list:
            if "[ERROR]" in line:
                error_logs[application_id][container_id]['ERROR'].append((line))
                flag = "ERROR"
            elif "[WARN]" in line:
                error_logs[application_id][container_id]['WARN'].append((line))
                flag = "WARN"
            elif "[INFO]" in line:
                flag = "INFO"
            else:
                if flag != "INFO":
                    error_logs[application_id][container_id][flag][-1] = str(error_logs[application_id][container_id][flag][-1])+(str(line))

            #Checking if the any keyword occured in the line and adding to keyword logs
            temp_line = ''
            k = ''
            if 'class path' in line or 'CLASSPATH' in line or 'java.class.path' in line:
                continue
            for key in keyword.split(','):
                if key.lower() in line.lower() and key != "":
                    temp_line = line
                    k = str(application_id)+"-->"+str(container_id)+"-->"+flag
                    if k not in keyword_app_logs.keys():
                        keyword_app_logs[k] = []
            if k != '':
                keyword_app_logs[k].append(temp_line)

    except Exception as e:
        pass


#Function to get cluster id and return all query logs
def get_query_logs(id, keyword, hive_log_paths):
    #Defining global and local variables
    cluster_id = id
    global query_logs
    global keyword_query_logs
    query_logs={}
    keyword_query_logs = {}
    
    #Getting list of all hive log paths
    log_list = []
    log_list = hive_log_paths

    #multithreading to get logs from each of the hive log path
    with concurrent.futures.ThreadPoolExecutor() as executor:

        results = []
        for i in log_list:
            path = str(i)
            f = executor.submit(FindErrorInQuery, path, keyword)
            results.append(f)

        for r in concurrent.futures.as_completed(results):
            r.result()

    return (query_logs, keyword_query_logs)

#Getting the logs from given cluster id and application id
def get_app_logs(id, application_id, keyword, app_log_paths):
    #Defining global and local variables
    cluster_id = id
    global error_logs
    global keyword_app_logs
    keyword_app_logs = {}
    error_logs = {}
    
    #Getting all application log files paths and storing in a list
    log_list = []
    for i in app_log_paths:
        if application_id in i:
            log_list.append(i)

    #Mutitreading for getting logs from each application log files
    with concurrent.futures.ThreadPoolExecutor() as executor:

        results = []
        for i in log_list:
            path = str(i)

            f = executor.submit(FindErrorInContainer, path, keyword)
            results.append(f)

        for r in concurrent.futures.as_completed(results):
            r.result()

    return (error_logs, keyword_app_logs)


#Function to get application ids associated with a given query id
def give_app_ids_in_query(file_path, chosen_query_id):
    #Global variables
    global app_ids

    try:
        #reading data from file and storing in a list
        with gzip.open(file_path, 'rb') as f:
            filedata = f.read()
        data = filedata.decode('utf-8')
        data_list = data.split('\n')

        lines=[]
        for myline in data_list:
            lines.append(myline)

        #Getting logs of a given query, checking for any application ids and storing them in a list
        start_line_number_for_query= len(lines)-1
        end_line_number_for_query = len(lines)-1

        for line_number in range(len(lines)):
            if( " - Compiling command(queryId="+chosen_query_id in lines[line_number]):
                start_line_number_for_query= line_number
            if( " - Compiling command(queryId=" in lines[line_number] and line_number> start_line_number_for_query):
                end_line_number_for_query= line_number
                break
        for i in range(start_line_number_for_query, end_line_number_for_query):
            if " - Status: Running (Executing on YARN cluster with App id" in lines[i]:
                appid=lines[i].split(' ')[-1][0:-1]
                app_ids.append(appid)

    except Exception as e:
        pass

def get_app_ids(id, query_id, hive_log_paths):
    #Defining local and global variables
    global app_ids
    app_ids = []
    cluster_id = id
    
    #Creating list containing all application log paths
    log_list = []
    log_list = hive_log_paths

    #multithreading to get all application logs
    with concurrent.futures.ThreadPoolExecutor() as executor:

        results = []
        for i in log_list:
            path = str(i)
            f = executor.submit(give_app_ids_in_query, path, query_id)
            results.append(f)

        for r in concurrent.futures.as_completed(results):
            r.result()

    return app_ids

#Function to return a dictionary of all query paths in the cluster
def get_query_paths():
    return query_paths


#Function to get specific errors
def get_specific_errors(JsonRes):
    
    #List containing specific errors
    keywords_sp_error= [ "FAILED: ParseException", "Unsupported Hive type",
    "MetaException", "Invalid entry in mapping", "AlreadyExistsException", "java.lang.RuntimeException: Unable to instantiate org.apache.hadoop.hive.ql.metadata.SessionHiveMetaStoreClient",
    "java.net.ConnectException: Connection refused", "SemanticException","Killing container"];

    SPECIFIC_ERROR_L = []

    Jsonlength=len(JsonRes)
    for SError in keywords_sp_error:
        SPECIFIC_ERROR = {}
        SPECIFIC_ERROR[SError]={}
        for i in range(Jsonlength):
            temp=JsonRes[i]
            ContaineridL=list(temp.keys())
            ContainerID=ContaineridL[0]
            value=temp[ContainerID]
            ErrL=value['ERROR']
            for err in ErrL:
                if SError in err:
                    if ContainerID in SPECIFIC_ERROR[SError]:
                        SPECIFIC_ERROR[SError][ContainerID].append(err)
                    else:
                        SPECIFIC_ERROR[SError][ContainerID]=[]
                        SPECIFIC_ERROR[SError][ContainerID].append(err)

        if SPECIFIC_ERROR not in SPECIFIC_ERROR_L:
            SPECIFIC_ERROR_L.append(SPECIFIC_ERROR)
    return SPECIFIC_ERROR_L


#Function to get specific warnings
def get_specific_warnings(JsonRes):

    keywords_sp_error= [ "METASTORE_FILTER_HOOK will be ignored",
    "Hive-on-MR is deprecated in Hive 2 and may not be available in the future versions",
    "Group org.apache.hadoop.mapred.Task$Counter is deprecated"];

    SPECIFIC_ERROR_L = []

    Jsonlength=len(JsonRes)
    for SError in keywords_sp_error:
        SPECIFIC_ERROR = {}
        SPECIFIC_ERROR[SError]={}
        for i in range(Jsonlength):
            temp=JsonRes[i]
            ContaineridL=list(temp.keys())
            ContainerID=ContaineridL[0]
            value=temp[ContainerID]
            ErrL=value['WARN']
            for err in ErrL:
                if SError in err:
                    if ContainerID in SPECIFIC_ERROR[SError]:
                        SPECIFIC_ERROR[SError][ContainerID].append(err)
                    else:
                        SPECIFIC_ERROR[SError][ContainerID]=[]
                        SPECIFIC_ERROR[SError][ContainerID].append(err)

        if SPECIFIC_ERROR not in SPECIFIC_ERROR_L:
            SPECIFIC_ERROR_L.append(SPECIFIC_ERROR)
    return SPECIFIC_ERROR_L
 
