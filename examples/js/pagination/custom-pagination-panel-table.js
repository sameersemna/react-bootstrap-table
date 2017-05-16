/* eslint max-len: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


const products = [];

function addProducts(quantity) {
  const startId = products.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i;
    products.push({
      id: id,
      name: 'Item name ' + id,
      price: 2100 + i
    });
  }
}

addProducts(100);

export default class CustomPaginationPanelTable extends React.Component {

  renderPanel(props) {
    return (
      <div>
        <div>{ props.components.pageList }</div>
        <div>
          <span>Change size per page: </span>
          { props.components.sizePerPageDropdown }
        </div>
        <div>
          <button onClick={ () => props.changeSizePerPage(10) } className='btn btn-default'>Click to force size per page as 10</button>
          <button onClick={ () => props.toggleDropDown() } className='btn btn-default'>Click to force toggle dropdown</button>
          <button onClick={ () => props.changePage(3) } className='btn btn-default'>Jump to page 3</button>
        </div>
      </div>
    );
  }

  render() {
    const options = {
      page: 2,  // which page you want to show as default
      sizePerPageList: [ {
        text: '5', value: 5
      }, {
        text: '10', value: 10
      }, {
        text: 'All', value: products.length
      } ], // you can change the dropdown list for size per page
      sizePerPage: 5,  // which size per page you want to locate as default
      pageStartIndex: 0, // where to start counting the pages
      paginationSize: 3,  // the pagination bar size.
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationPanel: this.renderPanel  // Accept function
    };

    return (
      <BootstrapTable data={ products } pagination={ true } options={ options }>
          <TableHeaderColumn dataField='id' isKey={ true }>Product ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
          <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
