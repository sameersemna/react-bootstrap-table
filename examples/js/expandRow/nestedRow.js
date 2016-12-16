/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const products = [];

function addProducts(quantity) {
  // const startId = products.length;
  for (let i = 0; i < quantity; ) {
    products.push({
      id: i,
      name: 'Item name ' + i,
      price: 2100 + i,
      data_nesting: { level: 0, parent: false }
    });
    const parentId = i;
    for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
      i++;
      products.push({
        id: i,
        name: 'Item name ' + i,
        price: 2100 + j,
        data_nesting: { level: 1, parent: parentId }
      });
      const parentId2 = i;
      for (let k = 0; k < Math.floor(Math.random() * 5) + 1; k++) {
        i++;
        products.push({
          id: i,
          name: 'Item name ' + i,
          price: 2100 + k,
          data_nesting: { level: 2, parent: parentId2 }
        });
      }
    }
    i++;
  }
}
addProducts(50);

export default class NestedRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const options = {
      expandRowBgColor: 'rgb(242, 255, 163)'
    };
    return (
      <BootstrapTable data={ products }
        options={ options }
        nestedRows={ true }
        nestedRowsOptions={ { showCaret: true } }
        search>
        <TableHeaderColumn dataField='id' isKey={ true }>Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
