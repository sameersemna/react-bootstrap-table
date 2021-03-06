/* eslint no-console: 0 */
/* eslint no-console: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


const products = [];
const footerData = [];

function addProducts(quantity) {
  const startId = products.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i;
    products.push({
      id: id,
      name: 'Item name ' + (Math.floor(Math.random() * 9) + 1),
      price: Math.floor(Math.random() * 3) + 1,
      rate: Math.floor(Math.random() * 5) + 1,
      quantity: Math.floor(Math.random() * 7) + 1,
      stock: Math.floor(Math.random() * 9) + 1
    });
  }
}

addProducts(50);

footerData.push({
  id: '',
  name: 'Totals',
  price: 22000,
  rate: 22000,
  quantity: 22000,
  stock: 22000
});

export default class ResizableColumnTable extends React.Component {
  // columnResizing(e, newWidth) {
  //   console.log(newWidth);
  //   console.dir(this);
  //   // this.refs.restable._adjustTable();
  //   // this.refs.restable.forceUpdate();
  //   this.forceUpdate();
  // }
  // columnSorting(order, dataField) {
  //   console.log(order);
  //   console.log(dataField);
  // }
  onSortChange = (sortName, sortOrder) => {
    // console.log(sortName);
    console.log(sortOrder);
  }
  onResizing(e, newWidth, col) {
    console.log(col.props.dataField);
  }
  onStartResizing(e, x, width) {
    console.log(x, width);
  }
  onStopResizing(e, x, width) {
    console.log(x, width);
  }
  componentWillMount() {
    // this.columnResizing = this.columnResizing.bind(this);
  }
  render() {
    const options = {
      onSortChange: this.onSortChange,
      onResizing: this.onResizing,
      onStartResizing: this.onStartResizing,
      onStopResizing: this.onStopResizing// ,
      // defaultSortName: 'price',
      // defaultSortOrder: 'asc'
    };

    const sortCols = [
      { number: 1, field: 'price', order: 'desc' },
      { number: 2, field: 'rate', order: 'asc' },
      { number: 3, field: 'quantity', order: 'desc' }
    ];

    return (
      <BootstrapTable ref='restable' data={ products } options={ options }
        footerData={ footerData } height='800px'
        resizable={ true } fillColumn={ 5 } fillColumnAdjust={ -10 }
        multiSort={ true }
        sortCols={ sortCols } multiSortKey='shiftKey'>
        <TableHeaderColumn dataField='id' isKey={ true } dataSort resize
          resizeOptions={ { minWidth: 100, maxWidth: false } }>Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField='name' dataSort resize
          // onResizing={ this.columnResizing }
          // onSort={ this.columnSorting }
          resizeOptions={ { minWidth: 200, maxWidth: false } }>Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField='price' dataSort resize
          resizeOptions={ { minWidth: 200, maxWidth: false } }>Product Price</TableHeaderColumn>
        <TableHeaderColumn dataField='rate' dataSort resize width='150px'
          resizeOptions={ { minWidth: 100, maxWidth: 200 } }>Rate</TableHeaderColumn>
        <TableHeaderColumn dataField='quantity' dataSort resize
          resizeOptions={ { minWidth: 100, maxWidth: false } }>Quantity</TableHeaderColumn>
        <TableHeaderColumn dataField='stock' dataSort
          resizeOptions={ { minWidth: 100, maxWidth: false } }>Stock</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
