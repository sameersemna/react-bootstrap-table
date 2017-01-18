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
    const rowId = parentId !== false ? parentId + '_' + i : i;
    prods.push({
      id: rowId,
      name: 'Item name ' + i,
      price: 2100 + getRand(100),
      level: 'Level ' + level,
      parent: parentId,
      _data_nesting: { level: level, parent: parentId, hasChildren: level < 5 ? true : false },
      _data_children: level < 5 ? getProducts(getRand(5), level + 1, rowId) : []
    });
    i++;
  }
  return prods;
}

function addProducts(quantity) {
  products = getProducts(quantity, 0, false);
}
addProducts(10);
// console.dir(products);

function caretClick(row) {
  console.dir(row);
}

export default class NestedRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const options = {
      expandRowBgColor: 'rgb(242, 255, 163)',
      onCaretClick: caretClick
    };
    return (
      <BootstrapTable data={ products }
        options={ options }
        nestedRows={ true }
        nestedRowsOptions={ { showCaret: true } }
        search>
        <TableHeaderColumn dataField='id' isKey={ true }>Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField='price' dataSort>Product Price</TableHeaderColumn>
        <TableHeaderColumn dataField='level'>Level</TableHeaderColumn>
        <TableHeaderColumn dataField='parent'>Parent</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
