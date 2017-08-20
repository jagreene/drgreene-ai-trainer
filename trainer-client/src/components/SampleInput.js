import React, {PureComponent} from 'react';

import Highlighter from 'react-highlight-words';
import Card from './Card.js';

import {Creatable} from 'react-select';
import './SampleInput.css';
import 'react-select/dist/react-select.css';

import {lambdaUrl} from '../config.js';

class SampleInput extends PureComponent {
  constructor(){
    super();
    this.state = {
      expression: "",
      keywords: "",
      intent: "",
      response: "",
      conflictingExpression: false,
      confidenceThreshold: 0,
    };

    this.keywordsTimer = null;
  }

  updateExpression = (e) => {
    const expression = e.target.value;
    this.setState({
      expression,
      conflictingExpression: this.props.compareExpressions(expression)
    });
    window.clearTimeout(this.keywordsTimer);
    this.keywordsTimer = window.setTimeout(this.primeKeywordsRequest(expression), 200);
  }

  primeKeywordsRequest = (expression) => () => {
    fetch(`${lambdaUrl}/keywords`, {
      headers: {
        'Accept': 'application/json', },
      method: "Post",
      body: JSON.stringify({text: expression})
    }).then(res => {
      return res.json()
    }).then(keywords => {
      this.setState(() => {
        return {keywords}
      });
    })
  }

  updateIntent = (pick) => {
    this.setState({intent: pick.value});
  }

  updateResponse = (pick) => {
    this.setState({response: pick.value});
  }

  updateConfidenceThreshold = (e) => {
    this.setState({confidenceThreshold: e.target.value});
  }

  submitSample = (e) => {
    e.preventDefault();
    const {expression, intent, response} = this.state;
    this.props.addStory(expression, intent, response);
    this.setState({
      expression: "",
      keywords: "",
      conflictingExpression: false,
    })
  }

  filterKeywords = () =>
    Array.from(Object.entries(this.state.keywords).reduce((acc, [keyword, confidence]) => {
      if (confidence > this.state.confidenceThreshold) {
        const splitBigram = keyword.split(" ");
        for (let unigram of splitBigram) {acc.add(unigram)}
      }
      return acc;
    }, new Set()));

  constructFilteredExpression = (expression, filteredKeywords) => {
    const filteredWords = expression.split(" ").filter((word) =>
      filteredKeywords.includes(word)
    )
    return filteredWords.join(" ");
  }

  render() {
    const {expression, response, intent, conflictingExpression, confidenceThreshold} = this.state;
    const filteredKeywords = this.filterKeywords(this.state.keywords);
    const filteredExpression = this.constructFilteredExpression(expression, filteredKeywords);
    return (
      <Card
        style={{width: "80vw"}}
        mx={1}
        key={'text'}
      >
        <h2 className="label"> Keywords: </h2>
        <div className="input">
          <Highlighter
            className="keywords"
            textToHighlight={expression ? expression : "None!"}
            searchWords={filteredKeywords}
          />
        </div>
        <h2 className="label"> Conflict: </h2>
        <div className="input">
          {conflictingExpression ? conflictingExpression : "None!"}
        </div>
        <form className="sample-input" onSubmit={this.submitSample}>
          <h2 className="label"> Kc </h2>
          <input
            id="confidence-slider"
            className="slider"
            type="range"
            min={0}
            max={1}
            step={.01}
            value={confidenceThreshold}
            onChange={this.updateConfidenceThreshold}
          />
          <h2 className="label"> User Input: </h2>
          <input className="input"
            type="text"
            onChange={this.updateExpression}
            value={expression}
          />
          <h2 className="label"> Intent: </h2>
          <Creatable
            className={"select"}
            options={this.props.intents}
            onChange={this.updateIntent}
            value={this.state.intent}
          />
          <h2 className="label"> Response: </h2>
          <Creatable
            className={"select"}
            options={this.props.responses}
            onChange={this.updateResponse}
            value={this.state.response}
          />
          <br/>
          <input
            className="sample-submit"
            type="submit"
            value="Add Sample"
            disabled={(!intent || !filteredExpression || !response) || conflictingExpression}
          />
        </form>
      </Card>
    )
  }
}

export default SampleInput;
