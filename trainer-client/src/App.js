import React, { PureComponent } from 'react';
import './App.css';

import {Flex} from 'reflexbox';
import Dropzone from 'react-dropzone';

import Navbar from './components/Navbar.js';
import SampleInput from './components/SampleInput.js';
import SubmitButton from './components/SubmitButton.js';

import {
  expressionPresent,
  intentPresent,
  actionPresent,
  addAction,
  addExpression,
  addIntent,
  addStory,
} from './actions/wit.js';

import {extract, zipTree} from './actions/zip.js'

class App extends PureComponent {
  constructor() {
    super();
    this.Reader = new FileReader();
    this.Reader.onload = this.loadFiles
    this.similarityThreshold = .7;
    this.state = {
      loaded: false,
      intent: {values: []},
      actions: [],
    }
  };

  onDrop = (files) => {
    this.Reader.readAsArrayBuffer(files[0]);
  }

  loadFiles = () => {
    extract(this.Reader.result)
    .then(fileTree => {
      this.setState({...fileTree, loaded: true})
    })
  };

  cleanIntents = () => {
    return this.state.intent.values.map((intent) => ({value:intent.value, label:intent.value}))
  }

  cleanResponses = () => {
    return this.state.actions.map((action) => ({value:action.template, label:action.template}))
  }

  compareExpressions = (expression) => {
    return expressionPresent(this.state.expressions, expression, this.similarityThreshold)
  }

  downloadZip = () => {
    const {loaded, ...fileTree} = this.state;
    console.log("DLING")
    zipTree(fileTree);
  }

  addStory = (expression, intent, response) => {
    const intents = intentPresent(this.state.intent, intent) ?
      this.state.intent : addIntent(this.state.intent, intent);

    const actions = actionPresent(this.state.actions, response)
      ? this.state.actions : addAction(this.state.actions, response);

    const expressions = addExpression(this.state.expressions, expression, intent);

    const story = {
      expression,
      intent,
      response
    };

    console.log(intents);
    const stories = addStory(this.state.stories, story);

    this.setState({intent:intents, actions, stories, expressions});

  }

  render() {
    const meat = this.state.loaded ? (
      <Flex align="flex-start" justify="center" column={true} style={{height: "100%"}}>
        <SampleInput
          compareExpressions={this.compareExpressions}
          addStory={this.addStory}
          intents={this.cleanIntents(this.state.intents)}
          responses={this.cleanResponses(this.state.actions)}
        />
        <SubmitButton
          downloadZip={this.downloadZip}
        />
      </Flex>) : (
      <Dropzone onDrop={this.onDrop} multiple={false}>
        <h2> Drop the exported bot files here </h2>
      </Dropzone>
    );

    return (
      <div className="App">
        <Navbar style={{height: '65px'}}/>
        <Flex style={{height: 'calc(100vh - 65px - 16px)'}} align={'center'} justify={'center'}>
          {meat}
        </Flex>
      </div>
    );
  }
}

export default App;
