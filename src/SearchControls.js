import React from "react";

class SearchControls extends React.Component {

    constructor() {
        super();

        this.state = {
            searchBySeries: true,
            searchBySeriesText: "Searching by Amiibo Series"
        }
    }

    searchSelector = (e) => {

        let searchText = "";

        if (e.target.checked === true) {
            searchText = "Searching by Amiibo Series"
        } else {
            searchText = "Searching by Video Game"
        }

        this.setState({
            searchBySeries: e.target.checked,
            searchBySeriesText: searchText
        })
    }

    render() {

        return (
            <div className="search">
                <form action="">

                    <div>
                        <input type="checkbox" name="search-by-series" id="search-by-series" defaultChecked={true} onChange={this.searchSelector} />
                        <label htmlFor="search-by-series">{this.state.searchBySeriesText}</label>
                    </div>

                    <div className="search-categories">
                        <select onChange={this.props.handleChangeAmiiboSeries} disabled={!this.state.searchBySeries} name="amiiboSeries">
                            <option value="0">Any Amiibo Series</option>
                            {
                                this.props.amiiboSeries.map((amiiboObject) => {
                                    return <option key={amiiboObject.key} value={amiiboObject.name}>{amiiboObject.name}</option>
                                })
                            }
                        </select>
                        <select onChange={this.props.handleChangeGameSeries} disabled={this.state.searchBySeries} name="gameSeries" id="">
                            <option value="0">Any Games</option>
                            {
                                this.props.gameSeries.map((amiiboObject) => {
                                    return <option key={amiiboObject.key} value={amiiboObject.name}>{amiiboObject.name}</option>
                                })
                            }
                        </select>
                    </div>

                    <div>
                        <input type="checkbox" defaultChecked={false} id="figures-only" name="figures-only" onChange={this.props.handleChangeFiguresOnly} />
                        <label htmlFor="figures-only">Figures Only (Excludes Cards and Wool Amiibos)</label>
                    </div>

                    <div>
                        <label htmlFor="char-search">Search by Character</label>
                        <input type="text" name="char-search" onChange={this.props.handleChangeTextInput} />
                    </div>

                    <label htmlFor="results-to-display">Results per page: </label>
                    <select onChange={this.props.handleResultCountChange} name="results-to-display">
                        <option value="12">12</option>
                        <option value="22">22</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                    </select>

                    <button onClick={this.props.getAmiibos}>Search for Amiibos</button>
                </form>
            </div>
        );
    }

}

export default SearchControls;