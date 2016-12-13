/* eslint max-len: 0 */
import React from 'react';
import ExpandRow from './ExpandRow';
import NestedRow from './NestedRow';
import renderLinks from '../utils';

import { Col, Panel } from 'react-bootstrap';

class Demo extends React.Component {
  render() {
    return (
      <Col md={ 8 } mdOffset={ 1 }>
        <Panel header={ 'A basic react-bootstrap-table with expandable row' }>
          { renderLinks('expandRow/expandRow.js') }
          <p>You can insert your customize component as a expand component</p>
          <ExpandRow/>
        </Panel>
        <Panel header={ 'A basic react-bootstrap-table with nested row' }>
          { renderLinks('expandRow/nestedRow.js') }
          <p>You can insert your customize component as a expand component</p>
          <NestedRow/>
        </Panel>
      </Col>
    );
  }
}

export default Demo;
