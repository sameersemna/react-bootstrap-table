/* eslint max-len: 0 */
import React from 'react';
import ColumnFixedTable from './column-fixed-table';

class Demo extends React.Component {
  render() {
    return (
      <div>
        <div className='col-md-offset-1 col-md-8'>
          <div className='panel panel-default'>
            <div className='panel-heading'>Column Fixed Example</div>
            <div className='panel-body'>
              <h5>Source in /examples/js/column-fixed/column-fixed-table.js</h5>
              <ColumnFixedTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
