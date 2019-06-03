import React from 'react';
import './App.css';
import axios from "axios";
import AmiiboCard from "./AmiiboCard";
import SearchControls from './SearchControls';
import ResultPageCounter from './ResultPageCounter';

//images
import redMushroom from "../src/red-mushroom.png";
import greenMushroom from "../src/green-mushroom.png"




class App extends React.Component {


  constructor() {
    super();

    this.numberOfPages = 0;
    this.filteredSearchAmiibos = [];
    this.resultsToDisplay = 12;
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
      showInstructions: {
        display: 'initial'
      },
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

    //Update the array which will display the results depending on the page range (how many results to display) and the page number.
    let resultsDisplayArray = [];

    let pageRange = this.getPageRange(this.filteredSearchAmiibos, this.pageNumber, this.resultsToDisplay);
    resultsDisplayArray = this.filteredSearchAmiibos.slice(pageRange.start, pageRange.end);

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

    //build the page numbers which will let the user navigate to a desired page.
    for (let i = 1; i <= this.numberOfPages; i++) {
      this.pageCountJSX.push(<ResultPageCounter handleClickPageCount={this.handleClickPageCount} pageNum={i} key={i} />)
    }
  }

  componentDidMount() {

    //Axios call to get the amiibo series and game series information from the database and use them to populate the dropdown fields

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
    }).catch(() => {
      alert("The API containing the data did not respond to the request. Try again. If it still doesn't work, the API may be down or experiencing issues!");
    });

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
    }).catch(() => {
      alert("The API containing the data did not respond to the request. Try again. If it still doesn't work, the API may be down or experiencing issues!");
    });
  }

  getAmiibos(e) {

    //search the database using the selected search parameters via an Axios API call
    e.preventDefault();

    this.pageNumber = 0;

    if (this.characterSearch === "") {
      this.characterSearch = null;
    }


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
      //store the data returned from the API
      response = response.data.amiibo;
      this.filteredSearchAmiibos = [...response]
      this.setState({
        amiibos: response,
        noResultsFound: false,
      })

      this.displayResultCount();

    }).catch((error) => {

      this.filteredSearchAmiibos = [];
      this.setState({
        amiibos: []
      })
      // Error
      if (error.response) {
        if (error.response.data.code === 404) {
          //if no results were found, set a flag to display a message indicating so
          this.setState({
            noResultsFound: true
          })
        }
      } else if (error.request) {
        //alert box in the event the API experiences another error
        alert("The API containing the data did not respond to the request. Try again. If it still doesn't work, the API may be down or experiencing issues!");
      }
    });

  }

  handleChangeAmiiboSeries(e) {

    //update the category to be searched based on the amiibo series
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

    //update the category to be searched based on the video game series
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
    //change the number of results to be displayed and update the page range using the displayResultCount function
    this.resultsToDisplay = e.target.value;
    this.pageNumber = 0;
    this.displayResultCount();
  }

  handleChangeTextInput(e) {

    //when the text input changes, use a REGEX search to filter through the displayed results, updating the results to be displayed at the same time
    this.pageNumber = 0;

    let regex = new RegExp(e.target.value, "i");
    let returnedAmiibos = [];

    returnedAmiibos = this.state.amiibos.filter((amiibo) => {
      return regex.test(amiibo.character);
    });

    this.filteredSearchAmiibos = [...returnedAmiibos];

    this.characterSearch = e.target.value;

    this.displayResultCount();

  }

  handleChangeFiguresOnly = (e) => {

    //Allows the user to search for figures only in the API (no amiibo cards or wool amiibos)
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

    //changes the page number to be displayed when the user clicks
    this.pageNumber = pageNum;

    this.displayResultCount();
  }

  hideInstructions = () => {

    //applies CSS styling to remove the instructions when the user presses the X button
    this.setState({
      showInstructions: {
        display: 'none'
      }
    })
  }

  render() {

    this.calculateNumberOfPages();

    return (
      <div className="wrapper">

        {/* This section will let the user search for desired amiibos */}
        <header>
          <div className="header-container">
            <img src={redMushroom} alt="Small Red Mario Mushroom" />
            <h1>Amiibo Search</h1>
            <img src={greenMushroom} alt="Small Green Mario Mushroom" />
            <p className="header-credits">By Adam Pachulski, using the Amiibo API (amiiboapi.com)</p>
          </div>
          {this.state.amiiboSeriesLoading || this.state.gameSeriesLoading ? <p className="loadText">Connecting to database...</p> :
            <div className="instruction-controls-wrapper">
              <div className="controls-div instruction-controls-div">
                <SearchControls amiiboSeries={this.state.amiiboSeriesDropdown} gameSeries={this.state.gameSeriesDropdown} getAmiibos={this.getAmiibos} handleChangeTextInput={this.handleChangeTextInput} handleChangeAmiiboSeries={this.handleChangeAmiiboSeries} handleChangeGameSeries={this.handleChangeGameSeries} handleResultCountChange={this.handleResultCountChange} handleChangeFiguresOnly={this.handleChangeFiguresOnly} />
              </div>
              <div className="instruction-div instruction-controls-div" style={this.state.showInstructions}>
                <button className="close-instructions" onClick={this.hideInstructions}>X</button>
                <p>Instructions:</p>
                <p>Use the search parameters to narrow down your amiibo. Character names can be entered in the search box to narrow down existing search results, or can be submitted via the search button to look for a specific character in the database.</p>
              </div>
            </div>
          }

        </header>

        {/* This section will be populated with the Amiibo results */}
        <section className="results-wrapper">
          <div className="search-pages">
            {this.numberOfPages > 0 && (
              <p>Pages of Results:</p>
            )}
            <p> {this.pageCountJSX} </p>
            {this.numberOfPages > 0 && (
              <p className="page-indicator">Displaying page {this.pageNumber + 1} of {this.numberOfPages}</p>
            )
            }
          </div>
          <div className="amiibo-results">
            {this.state.amiiboResultsToDisplayArray.map((amiibo) => {
              return <AmiiboCard imageURL={amiibo.image} charName={amiibo.character} videoGame={amiibo.gameSeries} releaseDate={amiibo.release.na} key={(amiibo.head + amiibo.tail)} />
            })}
            {this.state.noResultsFound === true && (
              <p className="no-results-text">No search results found for the exact character you entered. Try searching by Category first and then filtering results by typing in the character name.</p>
            )
            }
          </div>
          <div className="search-pages">
            {this.numberOfPages > 0 && (
              <p>Pages of Results:</p>
            )}
            <p> {this.pageCountJSX} </p>
            {this.numberOfPages > 0 && (
              <p className="page-indicator">Displaying page {this.pageNumber + 1} of {this.numberOfPages}</p>
            )
            }
          </div>
        </section>


      </div >
    );
  }

}

export default App;
