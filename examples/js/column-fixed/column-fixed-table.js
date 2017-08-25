/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


const products = [];

function addProducts(quantity) {
  const startId = products.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i + 1000;
    products.push({
      id: id,
      name: 'Item name ' + id,
      price: 2100 + i
    });
  }
}

addProducts(5);

export default class ColumnFixedTable extends React.Component {
  render() {
    return (
      <BootstrapTable data={ products }>
          <TableHeaderColumn dataField='id' isKey={ true } width='140px' fixed>Product ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
          <TableHeaderColumn dataField='price' width='140px'>Product Price</TableHeaderColumn>
          <TableHeaderColumn dataField='price' width='140px'>Product Price</TableHeaderColumn>
          <TableHeaderColumn dataField='price' width='140px'>Product Price</TableHeaderColumn>
          <TableHeaderColumn dataField='price' width='140px'>Product Price</TableHeaderColumn>
          <TableHeaderColumn dataField='price' width='140px'>Product Price</TableHeaderColumn>
          <TableHeaderColumn dataField='price' width='140px'>Product Price</TableHeaderColumn>
          <TableHeaderColumn dataField='price' width='140px'>Product Price</TableHeaderColumn>
          <TableHeaderColumn dataField='price' width='140px'>Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
