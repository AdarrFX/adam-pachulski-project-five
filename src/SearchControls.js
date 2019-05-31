import React from "react";

class SearchControls extends React.Component {

    constructor() {
        super();

        this.state = {

        }
    }

    render() {

        return (
            <div className="search">
                <form action="">
                    <input type="text" onChange={this.props.handleChangeTextInput}/>
                    <select onChange={this.props.handleChangeAmiiboSeries} name="amiiboSeries">
                    <option value="0">Any Amiibo Series</option>
                        {
                            this.props.amiiboSeries.map((amiiboObject) => {
                                return <option key={amiiboObject.key} value={amiiboObject.name}>{amiiboObject.name}</option>
                            })
                        }
                    </select>
                    <select onChange={this.props.handleChangeGameSeries} name="gameSeries" id="">
                        <option value="0">Any Games</option>
                        {
                            this.props.gameSeries.map((amiiboObject) => {
                                return <option key={amiiboObject.key} value={amiiboObject.name}>{amiiboObject.name}</option>
                            })
                        }
                    </select>
                    <select onChange={this.props.handleResultCountChange} name="resultsToDisplay">
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