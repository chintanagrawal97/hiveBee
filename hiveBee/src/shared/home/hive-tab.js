import React from 'react';
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";
import 'antd/dist/antd.css';
import './../../index.css';
import { Button } from 'antd';
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import { InfoCircleOutlined } from '@ant-design/icons';
import { notification } from 'antd';


const Notification = type => {
  notification[type]({
    message: 'Error',
    description:
      'Invalid Cluster ID or Query ID',
  });
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const initialState = {
  loading: false, /* loading while waiting for response */
  asyncf: true,
  response_body: [],
  allErrors: [],
  hiveClusterId: '', /* hive cluster id*/
  hiveQueryId: '', /* hive application id */
  keyword: '', /* keyword search*/
  hiveAppIds : '' , /* Hive applicationIds*/
  query_path: '',/*It gives the location of the query */
  requestNotComplete: true,
  keyword_query_errors: [],/* result of keyword search */
  hiveClusterIdError: '',/* error in hive cluster id*/
  locationError: '',/*error in location*/
  logLocation: '', /*location for logs*/
  exclusive: false,/* exclusive search from second page*/
  specificErrors: [],/* specific error*/
  specificWarnings: [],/* specific warning */
  keywordMemory: [''], /*Response limit exceded */
  resLen: 0,
  keywordLen:0,
  flag: 0
}

class HiveForm extends React.Component {
  state = initialState; /* Setting the state with initialState variable */

  async fetchHelloWorld() {
    const params = {
      /* ClusterID, ApplicationID, Keywords for search, exclusive is a flag set to false when keyword is searched from first page.
      exclusive is set to true when keyword is searched from second keyword tab page. */
      cluster_id: this.state.hiveClusterId,
      query_id: this.state.hiveQueryId,
      keyword: this.state.keyword,
      log_location: this.state.logLocation,
      exclusive: false
    };

    console.log("fetching python localhost");
    this.setState({ loading: true });
    await fetch("/Hive", {
      method:"POST",
      cache: "no-cache",
      headers:{
          "content_type":"application/json",
        },
      body:JSON.stringify(params)
    }
    ).then(response => {
        return response.json()
      })
    .then(json => {
      this.setState({response_body: json['body']});
    })
    //console.log(this.state.response_body);
    if(!this.state.response_body)
    {
      console.log(this.state.response_body)
      this.setState(initialState);
      Notification("error");
    }
    else
    { 
      //console.log(this.state.response_body);
      const response = JSON.parse(this.state.response_body);
      //console.log(response);
      this.setState({ allErrors: response.logs, loading: false, asyncf: true });
      //console.log(this.state.allErrors);
      this.setState({ query_path: response.query_path, loading: false, asyncf: true });
      this.setState({ keyword_query_errors: response.keyword_queries, loading: false, asyncf: true });
      this.setState({ specificErrors: response.specific_errors, loading: false, asyncf: true });
      this.setState({ specificWarnings: response.specific_warnings, loading: false, asyncf: true });
      this.setState({ keywordMemory: response.memory, loading: false, async: true });
      this.setState({keywordLen: response.KeywordLen, loading: false, async: true});
      this.setState({resLen: response.resLen, loading: false, async: true});
      this.setState({flag: response.flag, loading: false, asyncf: true});
      
      if (response.app_ids_found !== []) {
        this.setState({ hiveAppIds: response.app_ids_found });
      }
      /* If proper response was received , then call newPage() for redirecting to second page */
      this.newPage();
    }
  }

  /* Function to validate the inputs given in the form */
  validate = () => {
    let hiveClusterIdError = "";
    let locationError = "";
    let error = false;
    if (!this.state.hiveClusterId)/* Checking if Cluster ID was left empty */ 
      {
        hiveClusterIdError = "Please enter Cluster ID.";
      }
    if(!this.state.logLocation)
    {
      locationError = "Please enter location of cluster"
    }
      if (hiveClusterIdError || locationError)/* If any of the required field is empty */ {
        //console.log(this.state.logLocation);
        //console.log(this.state.hiveClusterId);
        //console.log(this.state.locationError);
        this.setState({ hiveClusterIdError });
        this.setState({locationError});
        error = true;/* set error to true*/

      }

      if (error) { return false; }
      return true;
  }

  mySubmitHandler = event => {
    event.preventDefault();
    const isvalid = this.validate() /* calling validate() to check the form inputs */
    if (isvalid) { /* If form inputs were valid then make the HTTP request */
      this.fetchHelloWorld();
    }


  }

  /* Function to redirect to the hive/mainPage along with the json response. */
  newPage = event => {
    this.props.history.push({
      pathname: '/hive', state: {
        data: this.state.allErrors,
        cluster_id: this.state.hiveClusterId,
        keyword: this.state.keyword,
        query_id: this.state.hiveQueryId,
        query_path: this.state.query_path,
        application_id: this.state.hiveAppIds,
        keyword_data: this.state.keyword_query_errors,
        specific_errors: this.state.specific_errors,
        specific_warnings: this.state.specific_warnings,
        keyword_memory: this.state.keyword_memory,
        log_location: this.state.log_location,
        KeywordLen: this.state.KeywordLen,
        resLen: this.state.resLen,
        flag: this.state.flag
      }
    });
  };



  /* Function to record the change in the input field and setting the latest input given by the user. */
  myChangeHandler = event => {
    const nam = event.target.name;
    const val = event.target.value.trim();
    this.setState({ [nam]: val });

  };
  

  browseResult(e){
    var fileselector = document.getElementById('fileselector');
    console.log(fileselector.value);
  }

  render() {
    console.log(this.props)
    return (
      <form>
        <fieldset>
          <legend className="required">
            <span className="number">1</span> Cluster ID
          </legend>
          <input /* Input for Cluster ID */
            type="text"
            name="hiveClusterId"
            className={this.state.hiveClusterIdError ? "inputerror" : "inputdefault"}
            value={this.state.hiveClusterId}
            onChange={this.myChangeHandler}
          />
          <div /* to show error */ className="error">{this.state.hiveClusterIdError}</div>
        </fieldset>

        <fieldset>
          <legend className="required">
            <span className="number">2</span> Logs Location
            <Tippy /* Used for information hovering */
              className="info" content={<span>
                PLease enter the log location without the Cluster ID</span>}>
              <InfoCircleOutlined style={{ padding: 4 }} />
            </Tippy >
          </legend>
          <input /* Input for Logs location */
            type="text"
            name="logLocation"
            className={this.state.locationError ? "inputerror" : "inputdefault"}
            value={this.state.logLocation}
            onChange={this.myChangeHandler}
          />
          <div /* to show error */ className="error">{this.state.locationError}</div>
        </fieldset>

        <fieldset>
          <legend>
            <span className="number">3</span> Query ID
            </legend>
          <input /* Input for Query ID */
            type="text"
            name="hiveQueryId"
            className={"inputdefault"}
            value={this.state.hiveQueryId}
            onChange={this.myChangeHandler} />
        </fieldset>


        <fieldset>

          <legend>
            <span className="number">4</span> Search By Keyword
            <Tippy /* Used for information hovering */
              className="info" content={<span>
                The application performs Auto Debugging.
                To search for specific keywords, please enter the keywords seperated by comma.
              Ex:Error, Fatal</span>}>
              <InfoCircleOutlined style={{ padding: 4 }} />
            </Tippy >
          </legend>
          <input /* Input for keyword search */
            type="text"
            name="keyword"
            className="inputdefault"
            placeholder="insert,drop"
            value={this.state.keyword}
            onChange={this.myChangeHandler}
          />
        </fieldset>

        <Button type="primary" id="submit" onClick={this.mySubmitHandler}>
          Submit
        </Button>
        <br></br>
        <br></br>
        <BarLoader /* The loading component */
          css={override}
          size={2000}
          width={200}
          color={"lightblue"}
          loading={this.state.loading}
        />
      </form>

    );
  }

}
export default HiveForm;

