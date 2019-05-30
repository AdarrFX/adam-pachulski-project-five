import React from 'react';
import './App.css';
import axios from "axios";
import AmiiboCard from "./AmiiboCard";
import SearchControls from './SearchControls';

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      amiibos: [],
      gameSeriesQuery: null,
      amiiboSeriesQuery: null,
      gameSeriesDropdown: [],
      amiiboSeriesDropdown: [],
      amiiboSeriesLoading: true,
      gameSeriesLoading: true
    }

    this.handleChangeAmiiboSeries = this.handleChangeAmiiboSeries.bind(this);
    this.handleChangeGameSeries = this.handleChangeGameSeries.bind(this);
    this.getAmiibos = this.getAmiibos.bind(this);

  }

  //because this object array strangely contains duplicate entries given by the API, we can remove the duplicate entries(https://stackoverflow.com/questions/32634736/javascript-object-array-removing-objects-with-duplicate-properties)
  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
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
      this.setState({
        amiibos: response,
      });

      console.log(this.state.amiibos);
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
      })
    } else {
      this.setState({
        gameSeriesQuery: e.target.value
      })
    }

  }

  // handleChangeTextInput(e) {


  //   let returnedAmiibos = this.state.amiibos.filter((amiibo) => {

  //   });

  // }

  render() {
    return (
      <div className="wrapper">

        {/* This section will let the user search for desired amiibos */}
        <header>
          <h1>Amiibo Browser</h1>

          {this.state.amiiboSeriesLoading || this.state.gameSeriesLoading ? <p className="loadText">Connecting to database...</p> :

            <SearchControls amiiboSeries={this.state.amiiboSeriesDropdown} gameSeries={this.state.gameSeriesDropdown} getAmiibos={this.getAmiibos} handleChangeAmiiboSeries={this.handleChangeAmiiboSeries} handleChangeGameSeries={this.handleChangeGameSeries} />

          }

        </header>

        {/* This section will be populated with the Amiibo results */}
        <section className="results-wrapper">
          <div className="amiibo-results">
            {this.state.amiibos.map((amiibo) => {
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
