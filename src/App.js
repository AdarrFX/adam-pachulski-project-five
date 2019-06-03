import React from 'react';
import './App.css';
import axios from "axios";
import AmiiboCard from "./AmiiboCard";
import SearchControls from './SearchControls';
import ResultPageCounter from './ResultPageCounter';




class App extends React.Component {


  constructor() {
    super();

    this.numberOfPages = 0;
    this.filteredSearchAmiibos = [];
    this.resultsToDisplay = 10;
    this.pageCountJSX = [];
    this.pageNumber = 0;
    this.characterSearch = "";
    
    this.state = {
      amiibos: [],
      gameSeriesQuery: null,
      amiiboSeriesQuery: null,
      searchByAmiiboSeries: true,
      gameSeriesDropdown: [],
      amiiboSeriesDropdown: [],
      amiiboSeriesLoading: true,
      gameSeriesLoading: true,
      noResultsFound: false,
      amiiboResultsToDisplayArray: [],
    }

    this.handleChangeAmiiboSeries = this.handleChangeAmiiboSeries.bind(this);
    this.handleChangeGameSeries = this.handleChangeGameSeries.bind(this);
    this.handleChangeTextInput = this.handleChangeTextInput.bind(this);
    this.handleResultCountChange = this.handleResultCountChange.bind(this);
    this.calculateNumberOfPages = this.calculateNumberOfPages.bind(this);
    this.getPageRange = this.getPageRange.bind(this);
    this.getAmiibos = this.getAmiibos.bind(this);

  }

  //because this object array strangely contains duplicate entries given by the API, we can remove the duplicate entries(https://stackoverflow.com/questions/32634736/javascript-object-array-removing-objects-with-duplicate-properties)
  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
    })
  }

  getPageRange(results, page, perPage) {
    let start;
    let end;

    if (results.length === 0) {
      // No results
      start = 0;
      end = 0;
    } else if (results.length < page * perPage) {
      // on the last page, but doesn't fill up all the space
      start = page * perPage;
      end = results.length;
    } else if (results.length >= page * perPage) {
      // Any page where the entire space is filled up
      start = page * perPage;
      end = (page + 1) * perPage;
    } else if (results.length > page * perPage) {
      // exceeded max page
      start = 0;
      end = 0;
    }

    return { start, end };
    // [start, end)
  }

  displayResultCount() {
    let resultsDisplayArray = [];

    let pageRange = this.getPageRange(this.filteredSearchAmiibos, this.pageNumber, this.resultsToDisplay);
    resultsDisplayArray = this.filteredSearchAmiibos.slice(pageRange.start, pageRange.end);

    console.log(this.getPageRange(this.filteredSearchAmiibos, this.pageNumber, this.resultsToDisplay))
    console.log(resultsDisplayArray);
    console.log("Above is the results")

    this.setState({
      amiiboResultsToDisplayArray: resultsDisplayArray
    })

  }

  calculateNumberOfPages() {
    this.pageCountJSX = [];

    // Find how many total pages will be displayed based on the amount of results to display at once.
    // ensure that the last page is added even if it doesn't have enough results to fill it completely
    // (if theres a remainder after division it means at least one more page is needed)

    if (this.filteredSearchAmiibos.length % this.resultsToDisplay > 0) {
      this.numberOfPages = Math.floor(this.filteredSearchAmiibos.length / this.resultsToDisplay) + 1;
    } else {
      this.numberOfPages = Math.floor(this.filteredSearchAmiibos.length / this.resultsToDisplay);
    }

    for (let i = 1; i <= this.numberOfPages; i++) {
      this.pageCountJSX.push(<ResultPageCounter handleClickPageCount={this.handleClickPageCount} pageNum={i} key={i} />)
    }
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

    this.pageNumber = 0;

    if (this.characterSearch === "") {
      this.characterSearch = null;
    }

    console.log("Figures only?" + this.state.figuresOnly)

    axios({
      method: "GET",
      url: "https://www.amiiboapi.com/api/amiibo/",
      dataResponse: "json",
      params: {
        format: "json",
        amiiboSeries: this.state.amiiboSeriesQuery,
        gameseries: this.state.gameSeriesQuery,
        character: this.characterSearch,
        type: this.state.figuresOnly
      }
    }).then((response) => {
      response = response.data.amiibo;
      this.filteredSearchAmiibos = [...response]
      this.setState({
        amiibos: response,
        noResultsFound: false,
      })

      console.log(this.state.amiibos);
      this.displayResultCount();
    }).catch((error) => {
      // Error
      if (error.response) {
        console.log(error.response.data.code)
        if (error.response.data.code == 404) {
          this.setState({
            noResultsFound: true
          })
        }
      } else if (error.request) {
        alert("The API containing the data did not respond to the request. Try again. If it still doesn't work, the API may be down or experiencing issues!");
        console.log(error.request);
      }
    });

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

    this.pageNumber = 0;

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

    this.characterSearch = e.target.value;

    this.displayResultCount();

  }

  handleChangeFiguresOnly = (e) => {
    if (e.target.checked === true) {
      this.setState({
        figuresOnly: "figure"
      })
    } else {
      this.setState({
        figuresOnly: null
      })
    }
  }

  handleClickPageCount = (pageNum) => {
    this.pageNumber = pageNum;

    this.displayResultCount();
  }

  render() {

    this.calculateNumberOfPages();

    console.log(this.noResultsFound + "no results found?")
    return (
      <div className="wrapper">

        {/* This section will let the user search for desired amiibos */}
        <header>
          <h1>Amiibo Browser</h1>

          {this.state.amiiboSeriesLoading || this.state.gameSeriesLoading ? <p className="loadText">Connecting to database...</p> :

            <SearchControls amiiboSeries={this.state.amiiboSeriesDropdown} gameSeries={this.state.gameSeriesDropdown} getAmiibos={this.getAmiibos} handleChangeTextInput={this.handleChangeTextInput} handleChangeAmiiboSeries={this.handleChangeAmiiboSeries} handleChangeGameSeries={this.handleChangeGameSeries} handleResultCountChange={this.handleResultCountChange} handleChangeFiguresOnly={this.handleChangeFiguresOnly} />

          }

        </header>

        {/* This section will be populated with the Amiibo results */}
        <section className="results-wrapper">
          <div className="amiibo-results">
            <div className="search-pages">
              <p> {this.pageCountJSX} </p>
              {this.numberOfPages > 0 && (
                <p className="page-indicator">Displaying page {this.pageNumber + 1} of {this.numberOfPages}</p>
              )
              }
            </div>
            {this.state.amiiboResultsToDisplayArray.map((amiibo) => {
              return <AmiiboCard imageURL={amiibo.image} charName={amiibo.character} videoGame={amiibo.gameSeries} releaseDate={amiibo.release.na} key={(amiibo.head + amiibo.tail)} />
            })}
            {this.state.noResultsFound === true && (
            <p className="no-results-text">No search results found for the exact character you entered. Try searching by Category first and then filtering results by typing in the character name.</p>
            )
            }
          </div>
        </section>


      </div >
    );
  }

}

export default App;
