// Importing Dependencies
import React from "react";

// Importing styling
import "./Bottle.css";

const Bottle = props => {
  return (
    <div className="bottle">
      <div className="bottle_name">{props.name.toUpperCase()}</div>
      <div className="bottle_id">ID: {props.id}</div>
      <div className="bottle_max">Max Liters: {props.max_liters}L</div>
      <div className="current_fill">
        Current Fill: {props.current_liters.toFixed(2)}L (
        {((props.current_liters / props.max_liters) * 100).toFixed(0)}%)
      </div>
    </div>
  );
};

export default Bottle;
