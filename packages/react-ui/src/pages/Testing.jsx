// Importing Dependencies
import React from "react";

// Importing styling
import "./Testing.css";

// Importing Components

const Testing = props => {
  const animation_style = {
    animationDuration: props.time + "s"
  };

  return (
    <div className="testing">
      Testing
      <div className="fill_animation">
        <div className="straw"></div>
        <div className="cup">
          <div className="liquid" style={animation_style}></div>
        </div>
      </div>
    </div>
  );
};

export default Testing;
