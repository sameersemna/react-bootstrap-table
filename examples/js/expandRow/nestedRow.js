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
      _data_nesting: { level: level, parent: parentId, hasChildren: level < 5 ? true : false, loading: false },
      // _data_children: level < 5 ? getProducts(getRand(5), level + 1, rowId) : []
      _data_children: []
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

export default class NestedRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: products
    };
  }

  setRowById(tabledata, rowid, callback) {
    let rowSet = false;
    let selectedRow;
    tabledata.some((row) => {
      if (row.id === rowid) {
        row._data_children = getProducts(getRand(5), row._data_nesting.level + 1, row.id);
        row._data_nesting.loading = false;

        selectedRow = row;
        rowSet = true;
        return true;
      } else if (row._data_children && row._data_children.length > 0) {
        selectedRow = this.setRowById(row._data_children, rowid, callback);
        return selectedRow ? true : false;
      }
    });
    this.setState({
      data: tabledata
    }, () => {
      if (rowSet) {
        callback(selectedRow);
      }
    });
    return selectedRow;
  }

  caretClick(row, callback) {
    if (row._data_children.length === 0) {
      row._data_nesting.loading = true;
      this.setRowById(this.state.data, row.id, callback);
      // row._data_children = getProducts(getRand(5), row._data_nesting.level + 1, row.id);
      // this.state.data[0] = row;

      /* products[0] = row;
      this.setState({
        data: products
      }); */
    }
  }

  render() {
    const options = {
      expandRowBgColor: 'rgb(242, 255, 163)',
      onCaretClick: this.caretClick.bind(this)
    };
    return (
      <BootstrapTable data={ this.state.data }
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
