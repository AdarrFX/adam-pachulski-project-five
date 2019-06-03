import React from "react";

class ResultPageCounter extends React.Component {

    constructor() {
        super();
    }

    render() {

        return (
            <React.Fragment>
                <span className="page-number" tabIndex="0" onClick={() => {
                    this.props.handleClickPageCount(this.props.pageNum - 1)
                }}> {this.props.pageNum} </span>
            </React.Fragment>
        );
    }

}

export default ResultPageCounter;