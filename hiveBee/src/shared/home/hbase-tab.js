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


const initialState={
  loading: false,
  asyncf: true,
  res:[],
  hbaseClusterId: "",
  hbaseStartDate:"",
  hbaseEndDate: "",
  hbaseLocation:"",
  keyword:"",
  clusterIdError:"",
  startDateError:"",
  endDateError:"",
  locationError:"",
  resLen: 0,
  KeywordLen:0
}


class HbaseForm extends React.Component {
  state = initialState; 

 
  /* Input Validation*/
  validate = () => {
    let clusterIdError="";
    let startDateError="";
    let endDateError="";
    let locationError="";
    let error=false;
    if(!this.state.hbaseClusterId)
    {
      clusterIdError="Please enter the Cluster ID.";
    }
    if(!this.state.hbaseStartDate)
    {
      startDateError="Please enter the Start Date.";
    }
    if(!this.state.hbaseEndDate)
    {
      endDateError="Please enter the End Date.";
    }
    if(!this.state.hbaseLocation)
    {
      locationError="Please enter a valid log location.";
    }
    if(clusterIdError||startDateError||endDateError||locationError)
    {
      this.setState({clusterIdError,startDateError,endDateError,locationError});
      error=true;
    }

    if(error)
    {return false;}
    return true;

  }

  myChangeHandler = event => {
    const nam = event.target.name;
    const val = event.target.value;
    this.setState({ [nam]: val });
  };

  mySubmitHandler = event => {
    event.preventDefault();
    const isvalid = this.validate() 
    if (isvalid) { /* On Validation Call make Request */
     console.log('Make Request')
    }


  


  };



  render() {
    console.log(this.props)
    return (
      <form >

        <fieldset>
          <legend className="required">
            <span class="number">1</span> Cluster ID
                  </legend>
                  <input  type="text"
                  required="true"
                    id="hbaseClusterId"
                    name="hbaseClusterId"
                    className={this.state.clusterIdError ? "inputerror":"inputdefault"}
                    value={this.state.hbaseClusterId}
                    onChange={this.myChangeHandler}
                  />
                  <div className="error">{this.state.clusterIdError}</div>
                </fieldset>
                <fieldset>
                <legend className="required">
                    <span class="number">2</span> Start Date
                  </legend>
                  <input  type="date" placeholder="YYYY-MM-DD" required="true" pattern="\d{4}-\d{1,2}-\d{1,2}"
                    id="hbaseClusterId"
                    name="hbaseStartDate"
                    className={this.state.startDateError ? "inputerror":"inputdefault"}
                    value={this.state.hbaseStartDate}
                    onChange={this.myChangeHandler}
                  />
                  <div className="error">{this.state.startDateError}</div>
                </fieldset>
                <fieldset>
                <legend className="required">
                    <span class="number">3</span>End Date
                  </legend>
                  <input  type="date" placeholder="YYYY-MM-DD" required="true" required pattern="\d{4}-\d{1,2}-\d{1,2}"
                    id="hbaseClusterId"
                    name="hbaseEndDate"
                    className={this.state.endDateError ? "inputerror":"inputdefault"}
                    value={this.state.hbaseEndDate}
                    onChange={this.myChangeHandler}
                  />
                  <div className="error">{this.state.endDateError}</div>
                </fieldset>
                <fieldset>
                  <legend className="required">
                    <span class="number">4</span> Logs Location
                    <Tippy className="info" content={<span>
              PLease enter the log location without the Cluster ID</span>}>
            <InfoCircleOutlined style={{padding: 4}}/>
            </Tippy>
                          </legend>
                          <input  type="text"
                          required="true"
                            id="hbaseClusterId"
                            name="hbaseLocation"
                            className={this.state.locationError ? "inputerror":"inputdefault"}
                            value={this.state.hbaseLocation}
                            onChange={this.myChangeHandler}
                          />
                          <div className="error">{this.state.locationError}</div>
                        </fieldset>
                <fieldset>
                  <legend>
                    <span class="number">5</span>Search By Keyword
                    <Tippy className="info" content={<span>
              The application performs Auto Debugging.
              To search for specific keywords, please enter the keywords seperated by comma.
              Ex:Error, Fatal</span>}>
            <InfoCircleOutlined style={{padding: 4}}/>
            </Tippy>
                  </legend>
                  <input className="inputdefault" type="text" placeholder="attempts,user data"
                    id="keyword"
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.myChangeHandler}
                  />
                </fieldset>
                <Button  type="primary" id="submit" onClick={this.mySubmitHandler}>
          Submit
        </Button>
        <br></br>
        <br></br>
       <BarLoader
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
export default HbaseForm;

