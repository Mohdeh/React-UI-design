import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import logo from './logo.svg';
import './App.css';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
// import Header from './Header';
// import SoftwareList from './SoftwareList';
const style = { display: 'flex', justifyContent: 'center', alignItems: 'center'}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      itemList: []
    };

    // this.apiUrl = "https://dev.dma.ucla.edu/api/";

    this.getAvailable = this.getAvailable.bind(this);
    this.handleSoftwareDelete = this.handleSoftwareDelete.bind(this);

  }
  
  getAvailable(){
    const url = ("https://dev.dma.ucla.edu/api/?data=SupportSoftwareList&action=getAllPrograms");   
    fetch(url)
    .then(
      (response) => response.json()
    )
    .then(function(data){
        console.log(data);
      this.setState({itemList: data});
      
    }.bind(this))
  }

  componentDidMount(){
    this.getAvailable();
  }

  
  handleSoftwareDelete(softwareName){
    console.log(softwareName);
    return function(event){      
      event.preventDefault();
      const url = ("https://dev.dma.ucla.edu/api/"); // post to URL "https://dev.dma.ucla.edu/api/?data=SupportSoftwareList&action=deleteSoftware"
      var formData = new FormData();
      formData.append("data", "SupportSoftwareList");
      formData.append("action", "deleteSoftware");
      formData.append("softwareName", softwareName);
      const fetchOptions = {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-type': 'application/json'
        },
        body: formData      
      }
      fetch(url, fetchOptions)
      .then((response) => { return response.json(); })
      .then(function(data){
        console.log(data);
        if (data["success"]){
          this.setState((prevState) => {
            const itemList = prevState.itemList;
            const softIndex = itemList.findIndex((software) => software.name == softwareName);
            itemList.splice(softIndex,1);
            return {itemList: itemList};
          })
        }
        else{
          alert("Could not delete software item");
        }
      }.bind(this))
    }.bind(this);
  }

  render() {    
    return (
      <div>
        <table id="software_table">
          <thead>
            <tr>
              <th> </th>
              <th>Software Name</th>
              <th>Windows?</th>
              <th>Macintosh?</th>
            </tr>
          </thead>
          <tbody>          
            {this.state.itemList.map((software)=>{
                return(
                <tr className="table-row-group" key={software.name}>
                  <td> 
                    <button className="btn btn-primary btn-sm" onClick={this.handleSoftwareDelete.bind(this, software.name)}> 
                      Delete 
                    </button> 
                  </td>
                  <td>  {software.name}  </td>
                  <td>  {software.win ==1 ? <div className="checkMark"> &#x2714; </div> : <div className="NA"> NA </div>}  </td>
                  <td>  {software.mac ==1 ? <div className="checkMark"> &#x2714; </div> : <div className="NA"> NA </div>}  </td>
                </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    );
  }  
}

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
