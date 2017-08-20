import React from 'react';
import {pure} from 'recompose';

import "./Navbar.css";

const Navbar = (props) => (
  <div className="navbar" style={{...props.style}}>
    <h2 className="navbar-heading">
      DrGreene <span style={{color: "#4fc3ea"}}> AI </span> Trainer
    </h2>
  </div>
)

export default pure(Navbar);
