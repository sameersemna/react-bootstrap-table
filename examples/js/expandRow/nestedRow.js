/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

let products = [];

function getRand(max) {
  return Math.floor(Math.random() * max) + 1;
}

function getProducts(quantity, level, parentId) {
  const prods = [];
  for (let i = 0; i < quantity; ) {
    const rowId = level + '_' + i;
    prods.push({
      id: rowId,
      name: 'Item name ' + i,
      price: 2100 + i,
      level: 'Level ' + level,
      parent: parentId,
      data_nesting: { level: level, parent: parentId },
      _data_children: level < 2 ? getProducts(getRand(10), level + 1, rowId) : []
    });
    i++;
  }
  return prods;
}

function addProducts(quantity) {
  products = getProducts(quantity, 0, false);
}
addProducts(50);
console.dir(products);

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
        <TableHeaderColumn dataField='level'>Level</TableHeaderColumn>
        <TableHeaderColumn dataField='parent'>Parent</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
