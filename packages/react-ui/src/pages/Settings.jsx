// Importing Dependencies
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "barbot-api";

// Importing styling
import "./Settings.css";

// Importing Components
import Header from "../components/Header";
import Bottle from "../components/Bottle";

const api = new API(
  `http://localhost:${process.env.REACT_APP_WEB_SERVER_PORT}`
);

const Settings = props => {
  const [bottles, setBottles] = useState([]);

  useEffect(() => {
    api.bottle.list().then(data => {
      console.log(data);
      setBottles(data.bottles);
    });
  }, []);

  const refill = bottleID => {
    api.bottle.refill(bottleID).then(() => {
      api.bottle.list().then(data => {
        console.log(data);
        setBottles(data.bottles);
      });
    });
  };

  const empty = (bottleID, currentFill) => {
    api.bottle.setFill(bottleID, 0).then(() => {
      api.bottle.list().then(data => {
        setBottles(data.bottles);
      });
    });
  };

  const twentyFive = (bottleID, currentFill) => {
    api.bottle.setFill(bottleID, 0.25).then(() => {
      api.bottle.list().then(data => {
        setBottles(data.bottles);
      });
    });
  };

  const fifty = (bottleID, currentFill) => {
    api.bottle.setFill(bottleID, 0.5).then(() => {
      api.bottle.list().then(data => {
        setBottles(data.bottles);
      });
    });
  };

  const seventyFive = (bottleID, currentFill) => {
    api.bottle.setFill(bottleID, 0.75).then(() => {
      api.bottle.list().then(data => {
        setBottles(data.bottles);
      });
    });
  };

  const setFill = (bottleID, currentFill) => {
    const newFill = parseFloat(
      prompt("new fill level (value 0 - 1)?", currentFill)
    );

    console.log("new fill:", newFill);

    api.bottle.setFill(bottleID, newFill).then(() => {
      api.bottle.list().then(data => {
        setBottles(data.bottles);
      });
    });
  };

  return (
    <div>
      <Header />
      <div className="setting">
        {/*
            All drinks
            All bottles
            Add/Remove a drink
            Add/Remove a bottle
            Refill bottles
            Lock machine */}
        <div className="bottle_list">
          {bottles.map(bottles => (
            <div
              style={{ border: "2px solid pink", marginBottom: "15px" }}
              key={bottles.id}
            >
              <Bottle
                name={bottles.name}
                id={bottles.id}
                max_liters={bottles.max_liters}
                current_liters={bottles.max_liters * bottles.fill}
                key={bottles.id}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{ cursor: "pointer", color: "yellow" }}
                  onClick={() => empty(bottles.id)}
                >
                  Empty
                </span>

                <span
                  style={{ cursor: "pointer", color: "yellow" }}
                  onClick={() => twentyFive(bottles.id)}
                >
                  25%
                </span>

                <span
                  style={{ cursor: "pointer", color: "yellow" }}
                  onClick={() => fifty(bottles.id)}
                >
                  50%
                </span>

                <span
                  style={{ cursor: "pointer", color: "yellow" }}
                  onClick={() => seventyFive(bottles.id)}
                >
                  75%
                </span>

                <span
                  style={{ cursor: "pointer", color: "yellow" }}
                  onClick={() => refill(bottles.id)}
                >
                  Refill
                </span>

                <span
                  style={{
                    cursor: "pointer",
                    color: "yellow",
                    marginLeft: "10px"
                  }}
                  onClick={() => setFill(bottles.id, bottles.fill)}
                >
                  Set Fill
                </span>
              </div>
            </div>
          ))}
        </div>

        <Link to="/" className="closing_time">
          <div className="lock"></div>
          <div className="closing_text">Closing Time</div>
        </Link>
      </div>
    </div>
  );
};

export default Settings;
