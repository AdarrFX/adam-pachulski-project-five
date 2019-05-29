import React from 'react';
import './App.css';
import axios from "axios";
import AmiiboCard from "./AmiiboCard";

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      amiibos: [],
      gameSeries: [],
      isLoading: true
    }

  }

  createDropdownCategory = function(dbInput, desiredSeries) {
    let dropdownCategories = [];
    let inCategory = false;

      dbInput.map((amiibo) => {

        for (let i = 0; i < dropdownCategories.length; i++) {
          if (amiibo[desiredSeries] == dropdownCategories[i]) {
            inCategory = true;
            i = dropdownCategories.length;
          }
        }

        if (inCategory == false) {
          dropdownCategories.push(amiibo[desiredSeries]);
        } else {
          inCategory = false;
        }
      })

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
        isLoading: false
      });

      console.log(this.createDropdownCategory(this.state.amiibos, "gameSeries"));
      console.log(this.createDropdownCategory(this.state.amiibos, "amiiboSeries"));
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
