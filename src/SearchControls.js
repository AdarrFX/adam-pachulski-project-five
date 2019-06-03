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
                        <label htmlFor="search-by-series">{this.state.searchBySeriesText}</label>
                        <input type="checkbox" name="search-by-series" id="search-by-series" defaultChecked={true} onChange={this.searchSelector} />
                    </div>

                    <div>
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
                        <label htmlFor="figures-only">Figures Only (Excludes Cards and Wool Amiibos)</label>
                        <input type="checkbox" defaultChecked={false} id="figures-only" name="figures-only" onChange={this.props.handleChangeFiguresOnly} />
                    </div>

                    <div>
                        <label htmlFor="char-search">Search by Character</label>
                        <input type="text" name="char-search" onChange={this.props.handleChangeTextInput} />
                    </div>

                    <label htmlFor="results-to-display">Results per page: </label>
                    <select onChange={this.props.handleResultCountChange} name="results-to-display">
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>

                    <button onClick={this.props.getAmiibos}>Search for Amiibos</button>
                </form>
            </div>
        );
    }

}

export default SearchControls;