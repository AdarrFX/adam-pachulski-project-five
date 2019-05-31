import React from 'react';
import './App.css';
import axios from "axios";
import AmiiboCard from "./AmiiboCard";
import SearchControls from './SearchControls';

class App extends React.Component {

  
  constructor() {
    super();

    let pageNumber = 1;
    this.filteredSearchAmiibos = [];
    this.resultsToDisplay = 10;
    
    this.state = {
      amiibos: [],
      gameSeriesQuery: null,
      amiiboSeriesQuery: null,
      gameSeriesDropdown: [],
      amiiboSeriesDropdown: [],
      amiiboSeriesLoading: true,
      gameSeriesLoading: true,
      amiiboResultsToDisplayArray: [],
    }

    this.handleChangeAmiiboSeries = this.handleChangeAmiiboSeries.bind(this);
    this.handleChangeGameSeries = this.handleChangeGameSeries.bind(this);
    this.handleChangeTextInput = this.handleChangeTextInput.bind(this);
    this.handleResultCountChange = this.handleResultCountChange.bind(this);
    this.getAmiibos = this.getAmiibos.bind(this);

  }

  //because this object array strangely contains duplicate entries given by the API, we can remove the duplicate entries(https://stackoverflow.com/questions/32634736/javascript-object-array-removing-objects-with-duplicate-properties)
  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
    })
  }

  displayResultCount() {
    let resultsDisplayArray = [];
   
    if (this.filteredSearchAmiibos.length <= this.resultsToDisplay){
     
      resultsDisplayArray = this.filteredSearchAmiibos.slice();
      console.log("Dsiplaying all results. Below view count.")
    } else {
      
      console.log("Results exceeds display count of " + this.resultsToDisplay + ". Truncating...")
      resultsDisplayArray = this.filteredSearchAmiibos.slice(0, this.resultsToDisplay)

      

    }

    this.setState({
      amiiboResultsToDisplayArray: resultsDisplayArray
    })
    
  }

  componentDidMount() {

    //Axios call to get the amiibo database

    axios({
      method: "GET",
      url: "https://www.amiiboapi.com/api/amiiboseries/",
      dataResponse: "json",
      params: {
        format: "json"
      }
    }).then((response) => {
      response = response.data.amiibo;
      this.setState({
        amiiboSeriesDropdown: response,
        amiiboSeriesLoading: false
      });
    })

    axios({
      method: "GET",
      url: "https://www.amiiboapi.com/api/gameseries/",
      dataResponse: "json",
      params: {
        format: "json"
      }
    }).then((response) => {
      response = response.data.amiibo;

      let uniqueGameSeries = [];
      uniqueGameSeries = this.removeDuplicates(response, "name");

      this.setState({
        gameSeriesDropdown: uniqueGameSeries,
        gameSeriesLoading: false
      });
    })
  }

  getAmiibos(e) {

    e.preventDefault();

    axios({
      method: "GET",
      url: "https://www.amiiboapi.com/api/amiibo/",
      dataResponse: "json",
      params: {
        format: "json",
        amiiboSeries: this.state.amiiboSeriesQuery,
        gameseries: this.state.gameSeriesQuery,
      }
    }).then((response) => {
      response = response.data.amiibo;
      this.filteredSearchAmiibos = [...response]
      this.setState({
        amiibos: response,
      });

      console.log(this.state.amiibos);
      this.displayResultCount();
    })

  }

  handleChangeAmiiboSeries(e) {

    console.log("Amiibo Series selected is: " + e.target.value);

    if (e.target.value === "0") {
      this.setState({
        amiiboSeriesQuery: null
      })
    } else {
      this.setState({
        amiiboSeriesQuery: e.target.value
      })
    }

  }

  handleChangeGameSeries(e) {

    console.log("Game Series selected is: " + e.target.value);
    if (e.target.value === "0") {
      this.setState({
        gameSeriesQuery: null
      });
    } else {
      this.setState({
        gameSeriesQuery: e.target.value
      });
    }
  }

  handleResultCountChange(e) {
    this.resultsToDisplay = e.target.value;
    this.displayResultCount();
  }

  handleChangeTextInput(e) {

    console.log(e.target.value)
    let match = false;

    let regex = new RegExp(e.target.value, "i");
    let returnedAmiibos = [];

    returnedAmiibos = this.state.amiibos.filter((amiibo) => {
      return regex.test(amiibo.character);
    });

    
    console.log("Number of matching items: " + returnedAmiibos.length)
    console.log(returnedAmiibos)

    this.filteredSearchAmiibos = [...returnedAmiibos];

    console.log("Number of items to display is: " + this.filteredSearchAmiibos.length)
    console.log(this.filteredSearchAmiibos)
    this.displayResultCount();

  }

  handleClickPageCount(e) {

  }

  render() {
    return (
      <div className="wrapper">

        {/* This section will let the user search for desired amiibos */}
        <header>
          <h1>Amiibo Browser</h1>

          {this.state.amiiboSeriesLoading || this.state.gameSeriesLoading ? <p className="loadText">Connecting to database...</p> :

            <SearchControls amiiboSeries={this.state.amiiboSeriesDropdown} gameSeries={this.state.gameSeriesDropdown} getAmiibos={this.getAmiibos} handleChangeTextInput={this.handleChangeTextInput} handleChangeAmiiboSeries={this.handleChangeAmiiboSeries} handleChangeGameSeries={this.handleChangeGameSeries} handleResultCountChange={this.handleResultCountChange} />

          }

        </header>

        {/* This section will be populated with the Amiibo results */}
        <section className="results-wrapper">
          <div className="amiibo-results">
            {this.state.amiiboResultsToDisplayArray.map((amiibo) => {
              return <AmiiboCard imageURL={amiibo.image} charName={amiibo.character} videoGame={amiibo.gameSeries} releaseDate={amiibo.release.na} key={(amiibo.head + amiibo.tail)} />
            })}
            <p>Placeholder Text</p>
          </div>
        </section>


      </div >
    );
  }

}

export default App;
