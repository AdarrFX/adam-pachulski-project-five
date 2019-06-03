import React from "react";

class ResultPageCounter extends React.Component {

    render() {

        return (
            <React.Fragment>
                <button className="page-number" tabIndex="0" onClick={() => {
                    this.props.handleClickPageCount(this.props.pageNum - 1)
                }}> {this.props.pageNum} </button>
            </React.Fragment>
        );
    }

}

export default ResultPageCounter;