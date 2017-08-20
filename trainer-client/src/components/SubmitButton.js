import React from 'react';
import {pure} from 'recompose';

import './SubmitButton.css';


const SubmitButton = (props) => {
  return (
    <button
      className="training-submit"
      onClick={props.downloadZip}
    >
      Download Bot
    </button>
  )
}

export default pure(SubmitButton)
