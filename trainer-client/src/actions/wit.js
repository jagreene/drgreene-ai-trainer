import stringSimilarity from 'string-similarity';

export const intentPresent = (intents, intent) =>
  intents.values.reduce((present, curr) => intent === curr.value ? true : present, false);

export const addIntent = (intents, intent) =>
  ({
    ...intents,
    values: [...intents.values, {value: intent}]
  });

export const actionPresent = (actions, action) =>
  actions.reduce((present, curr) => action === curr.template ? true : present, false);

export const addAction = (actions, action) =>
  [...actions, {
    id: `template-${action}`,
    template: action,
    type: "template"
  }];

export const expressionPresent = (expressions, expression, simThresh) =>
  expressions.reduce((present, curr) =>
    stringSimilarity.compareTwoStrings(curr.text, expression) > simThresh ? curr.text : present, false);

export const addExpression = (expressions, expression, intent) =>
  [...expressions, {
    entities: [
      {
        entity: "intent",
        value: `"${intent}"`,
      }
    ],
    text: expression,
  }];

export const addStory = (stories, story) =>
  [...stories, {
    name: "",
    turns: [
      {
        entities: [
          {
            entity: "intent",
            value: `"${story.intent}"`,
          }
        ],
        operations: [
          {
            action: `template-${story.response}`,
          }
        ],
        user: story.expression,
      }
    ],
  }];
