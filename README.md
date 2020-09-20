## HiveBee

An application to analyse your Hive & Hbase application logs and troubleshoot failures . 

## Description

The application consists of 2 modules namely Hive and Hbase. For each of the modules on giving the required input the application will parse the log files and display the commonly occurring error and warning, all the errors, warnings in a structured manner. Also, the application provides a feature to search for specific keywords in the entire log.

## The Idea

The original project was developed using Python based cli scripts . It felt more convenient to have React based UI to segreate Error , Warn logs and to be able to search in logs . 


## How To Use 

The application consists of 2 modules namely Hive and Hbase. For each of the modules on giving the required input the application will parse the log files and display the commonly occurring error and warning, all the errors, warnings in a structured manner. Also, the application provides a feature to search for specific keywords in the entire log.

1.  Hive Module will require the Cluster ID and an optional field to enter Query ID. On giving the Cluster ID, the application parses the hive logs in case of Cluster ID. But when the Query ID is also mentioned, the application then will check the logs corresponding to the Query ID.
