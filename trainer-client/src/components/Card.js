import React from 'react';

import {pure} from 'recompose';
import {Card} from 'rebass';

const CardWrapper = (props) => (
  <Card
    mx={1}
    style={{
      ...props.style,
      backgroundColor: 'white',
      maxWidth: 'calc(100% - 36px)',
      height: 'auto',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      borderStyle: 'none !important',
    }}
    key={'text'}
  >
    {props.children}
  </Card>
)

export default pure(CardWrapper);
