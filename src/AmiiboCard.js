import React from "react";

class AmiiboCard extends React.Component {

    

    render(){
        return(
            <div className="amiibo-card">
                <div className="amiibo-card-image">
                    <img src="" alt=""/>
                </div>
                <div className="amiibo-card-info">
                    <p>Character Name: <span className="amiibo-card-info-charname"></span></p>
                    <p>From Game: <span className="amiibo-card-info-game"></span></p>
                    <p>Release Date (NA): <span className="amiibo-card-info-releasedate"></span></p>
                </div>
            </div>
        );
    }

}

export default AmiiboCard;