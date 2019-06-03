import React from "react";

class AmiiboCard extends React.Component {

    render() {
        return (
            <div className="amiibo-card">
                <div className="amiibo-card-image">
                    <img src={this.props.imageURL} alt={this.props.charName} />
                </div>
                <div className="amiibo-card-info">
                    <p>Character Name: <span>{this.props.charName}</span></p>
                    <p>From Game: <span>{this.props.videoGame}</span></p>
                    <p>Release Date (NA): <span>{this.props.releaseDate}</span></p>

                </div>
            </div>
        );
    }

}

export default AmiiboCard;