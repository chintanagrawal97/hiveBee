import React from 'react';

var n=0; 

const TabButtons = ({ buttons, changeTab, activeTab }) => (
  <div className="tab-buttons">
    {buttons.map(button => (
      <button
        className={button === activeTab ? 'active' : ''}
        onClick={() => changeTab(button)}
      >
        {button}
      </button>
    ))}
  </div>
);

class Tabs extends React.Component {

  componentDidMount() { 
    document.title = 'EMR Debugging Script';
  }

  state = {
   
    activeTab: this.props.children[n].props.label, /* Keeps the active Tab label. Variable n determines the tab number. */
  };
  

  changeTab = tab => {
    
    this.setState({ activeTab: tab});

  };

  render() {
    let content = '';
    const buttons = [];

    return (
      <div>
        {React.Children.map(this.props.children, child => {

          buttons.push(child.props.label);

          if (child.props.label === this.state.activeTab)
            content = child.props.children;
        })}
         
        {React.Children.map(this.props.children, child => {
        
          if (child.props.id ==="0" && child.props.label === this.state.activeTab)
          {
            n=0; 
          }
          if (child.props.id ==="1" && child.props.label === this.state.activeTab)
          {
            n=1; 
          }
        })}
        
        <TabButtons 
          activeTab={this.state.activeTab}
          buttons={buttons}
          changeTab={this.changeTab}
        />
        <div className="tab-content">{content}</div>
      </div>
    );
  }
}

export default Tabs;
