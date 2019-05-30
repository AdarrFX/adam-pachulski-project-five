import React from 'react';
import './App.css';
import axios from "axios";
import AmiiboCard from "./AmiiboCard";

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      amiibos: [],
      gameSeries_dropdown: [],
      amiiboSeries_dropdown: [],
      isLoading: true
    }

  }

  //This function scans the given cateory (desiredseries) of the amiibo db input, and then returns a string array of categories to use for a drop down menu. This allows the dropdowns to be generated dynamically rather than being hardcoded in the event new categories or series are added to the API.
  createDropdownCategory (dbInput, desiredSeries) {
    const categories = {}
    dbInput.forEach(({ [desiredSeries]: category  }) => categories[category] = true)
    return Object.keys(categories);

    //////////////////////////////////////

    //Init the variable that will store the category entries and the flag that triggers when a category is already in the list
    let dropdownCategories = [];
    let inCategory = false;

    //map the dbInput values for each amiibo
      dbInput.map((amiibo) => {

        //loop through the existing list of categories and check to see if the selected category is already in the list
        for (let i = 0; i < dropdownCategories.length; i++) {
          if (amiibo[desiredSeries] == dropdownCategories[i]) {
            //if it is, terminate the for loop and set the flag to true
            inCategory = true;
            i = dropdownCategories.length;
          }
        }

        //if the category wasn't in the list yet, then add it, otherwise reset the flag to false and continue to the next amiibo to check its category
        if (inCategory == false) {
          dropdownCategories.push(amiibo[desiredSeries]);
        } else {
          inCategory = false;
        }
      })

      //return the string array of categories
      return dropdownCategories;
  }

  componentDidMount() {

    axios({
      method: "GET",
      url: "https://www.amiiboapi.com/api/amiibo/",
      dataResponse: "json",
      params: {
        format: "json"
      }
    }).then((response) => {
      response = response.data.amiibo;
      this.setState({
        amiibos: response,
        gameSeries_dropdown: this.createDropdownCategory(response, "gameSeries"),
        amiiboSeries_dropdown: this.createDropdownCategory(response, "amiiboSeries"),
        isLoading: false
      });
      console.log('amiibos', this.state.amiibos);
      console.log('game series', this.state.gameSeries_dropdown);
      console.log('amiibo series', this.state.amiiboSeries_dropdown);
    })

  }

  render() {
    return (
      <div className="wrapper">

        {/* This section will let the user search for desired amiibos */}
        <header>
          <h1>Amiibo Browser</h1>

          <form action="">
            <input type="text" />
            <select name="region" id="">Select Region</select>
            <select name="gameSeries" id="">Select Game Series</select>
            <button>Search for Amiibos</button>
          </form>

        </header>

        {/* This section will be populated with the Amiibo results */}
        <section>
          <p>Placeholder Text</p>
        </section>


      </div>
    );
  }

}

export default App;
