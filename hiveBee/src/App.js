import React from 'react';
import './App.css';
import { HbaseForm, HiveForm } from './shared/home';
import Tabs from './shared/tab';
 
/* Children tab component (HBase, Hive and Spark */
const Tab = props => <React.Fragment>{props.children}</React.Fragment>;

class App extends React.Component {
 
  render() {
    return (
      <div className="tabs">
        <Tabs>
   
        <Tab label="HBase" id="0">{/* First Tab for HBase */}
            <div>
              <img
                alt="Hbase-img"
                src="https://d1.awsstatic.com/product-marketing/EMR/hbase-logo.e139b77f7031062f738f0fc28210e0ffa6ca26c8.png"
              />
              <HbaseForm history={this.props.history} />{/* code for this form is imported from ./tab-content/components/index.js */}
            </div>
          </Tab>
            
          <Tab label="Hive" id="1">{/* Second Tab for Hive */}
            <div>
            <img
          alt="Hive-img"
          src="https://s3.amazonaws.com/karengryg.io/wp-content/uploads/2019/10/20183816/hive-logo.png"
          />
            <HiveForm history={this.props.history}/> {/* code for this form is imported from ./tab-content/components/index.js */}
            </div>
          </Tab>
         

        </Tabs>
      </div>
    );
  }
}

export default App;
