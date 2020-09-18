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
  query_path: '',/*It gives the location of the query */
  requestNotComplete: true,
  keyword_query_errors: [],/* result of keyword search */
  hiveClusterIdError: '',/* error in hive cluster id*/
  locationError: '',/*error in location*/
  logLocation: '', /*location for logs*/
  exclusive: false,/* exclusive search from second page*/
  specificErrors: [],/* specific error*/
  specificWarmnings: [],/* specific warning */
  keywordMemory: [''], /*Response limit exceded */
  resLen: 0,
  KeywordLen:0,
  flag: 0
}

class HiveForm extends React.Component {
  state = initialState; /* Setting the state with initialState variable */

 
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
     console.log('Make Request')
    }


  }

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

