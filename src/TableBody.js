import React, { Component, PropTypes } from 'react';
import Const from './Const';
import TableRow from './TableRow';
import TableColumn from './TableColumn';
import TableEditColumn from './TableEditColumn';
import classSet from 'classnames';
import ExpandComponent from './ExpandComponent';

let rowId;

const isFun = function(obj) {
  return obj && (typeof obj === 'function');
};

const mapColumns = function(column, i, data, r, object) {
  const { cellEdit } = object.props;
  const noneditableRows = (cellEdit.nonEditableRows && cellEdit.nonEditableRows()) || [];
  const fieldValue = data[column.name];
  if (column.name !== object.props.keyField && // Key field can't be edit
      column.editable && // column is editable? default is true, user can set it false
      object.state.currEditCell !== null &&
      object.state.currEditCell.rid === r &&
      object.state.currEditCell.cid === i &&
      noneditableRows.indexOf(data[object.props.keyField]) === -1) {
    let editable = column.editable;
    const format = column.format ? function(value) {
      return column.format(value, data, column.formatExtraData, r).replace(/<.*?>/g, '');
    } : false;
    if (isFun(column.editable)) {
      editable = column.editable(fieldValue, data, r, i);
    }

    return (
        <TableEditColumn
            completeEdit={ object.handleCompleteEditCell }
            // add by bluespring for column editor customize
            editable={ editable }
            customEditor={ column.customEditor }
            format={ column.format ? format : false }
            key={ i }
            blurToSave={ object.props.cellEdit.blurToSave }
            rowIndex={ r }
            colIndex={ i }
            row={ data }
            fieldValue={ fieldValue } />
    );
  } else {
    // add by bluespring for className customize
    let columnChild = fieldValue && fieldValue.toString();
    let columnTitle = null;
    const colSpan = 1;
    let tdClassName = column.className;
    if (isFun(column.className)) {
      tdClassName = column.className(fieldValue, data, r, i);
    }

    if (typeof column.format !== 'undefined') {
      const formattedValue = column.format(fieldValue, data, column.formatExtraData, r);
      if (!React.isValidElement(formattedValue)) {
        columnChild = (
            <div dangerouslySetInnerHTML={ { __html: formattedValue } }></div>
        );
      } else {
        columnChild = formattedValue;
        columnTitle = column.columnTitle && formattedValue ? formattedValue.toString() : null;
      }
    } else {
      columnTitle = column.columnTitle && fieldValue ? fieldValue.toString() : null;
    }
    return (
        <TableColumn key={ i }
                     colNo={ i }
                     nestedRows={ object.props.nestedRows }
                     nestedRowsOptions={ object.props.nestedRowsOptions }
                     rIndex={ r }
                     dataAlign={ column.align }
                     className={ tdClassName }
                     columnTitle={ columnTitle }
                     colSpan={ colSpan }
                     cellEdit={ object.props.cellEdit }
                     fixed={ column.fixed }
                     hidden={ column.hidden }
                     onEdit={ object.handleEditCell }
                     width={ column.width }>
          { columnChild }
        </TableColumn>
    );
  }
};

const mapTableRows = function(data, r, unselectable,
                              isSelectRowDefined, inputType, CustomComponent, object) {
  const tableColumns = object.props.columns.map((column, i) => {
    return mapColumns(column, i, data, r, object);
  }, object);
  const key = data[object.props.keyField];
  const disable = unselectable.indexOf(key) !== -1;
  const selected = object.props.selectedRowKeys.indexOf(key) !== -1;
  const selectRowColumn = isSelectRowDefined && !object.props.selectRow.hideSelectColumn ?
      object.renderSelectRowColumn(selected, inputType, disable, CustomComponent, r) : null;
  // add by bluespring for className customize
  let trClassName = object.props.trClassName;
  if (isFun(object.props.trClassName)) {
    trClassName = object.props.trClassName(data, r);
  }
  const dataNesting = data._data_nesting ?
  data._data_nesting : {
    level: 0,
    parent: null,
    hasChildren: false,
    loading: false,
    childrenShown: false
  };
  const isNested = object.props.nestedRows && dataNesting.parent !== false;
  const dataChildren = data._data_children ? data._data_children : [];

  let result = [ <TableRow isSelected={ selected } key={ key } className={ trClassName }
                ref={ key }
                index={ r }
                selectRow={ isSelectRowDefined ? object.props.selectRow : undefined }
                enableCellEdit={ object.props.cellEdit.mode !== Const.CELL_EDIT_NONE }
                onRowClick={ object.handleRowClick }
                onCaretClick={ object.handleCaretClick }
                onRowDoubleClick={ object.handleRowDoubleClick }
                onRowMouseOver={ object.handleRowMouseOver }
                onRowMouseOut={ object.handleRowMouseOut }
                onSelectRow={ object.handleSelectRow }
                unselectableRow={ disable }
                nestedRows={ object.props.nestedRows }
                level={ dataNesting.level }
                rowId={ key }
                parent={ dataNesting.parent }
                hasChildren={ dataNesting.hasChildren }
                countChildren={ dataChildren.length }
                dataLoading={ dataNesting.loading }
                isNested={ isNested }
                childrenShown={ dataNesting.childrenShown }>
        { selectRowColumn }
        { tableColumns }
      </TableRow> ];

  if (dataChildren.length > 0) {
    const childResult = [];

    /* dataChildren.forEach((dataChild) => {
      childResult.push(mapTableRows(dataChild, r, unselectable,
          isSelectRowDefined, inputType, CustomComponent, object));
    }); */

    dataChildren.map((dataChild) => {
      rowId++;
      childResult.push(mapTableRows(dataChild, rowId, unselectable,
          isSelectRowDefined, inputType, CustomComponent, object));
    });

    result = result.concat(childResult);
  }

  if (object.props.expandableRow && object.props.expandableRow(data)) {
    let colSpan = object.props.columns.length;
    const bgColor = object.props.expandRowBgColor || object.props.selectRow.bgColor || undefined;
    if (isSelectRowDefined && !object.props.selectRow.hideSelectColumn) {
      colSpan += 1;
    }
    result.push(
        <ExpandComponent
            className={ trClassName }
            bgColor={ bgColor }
            hidden={ !(object.state.expanding.indexOf(key) > -1) }
            colSpan={ colSpan }
            width={ "100%" }>
          { object.props.expandComponent(data) }
        </ExpandComponent>
    );
  }
  return (result);
};

const getSelectedRowById = function(data, rowid) {
  let selectedRow;
  data.some((row) => {
    if (row.id === rowid) {
      selectedRow = row;
      return true;
    } else if (row._data_children && row._data_children.length > 0) {
      selectedRow = getSelectedRowById(row._data_children, rowid);
      return selectedRow ? true : false;
    }
  });
  return selectedRow;
};

class TableBody extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currEditCell: null,
      expanding: [],
      lastExpand: null
    };
  }

  render() {
    const tableClasses = classSet('table', {
      'table-striped': this.props.striped,
      'table-bordered': this.props.bordered,
      'table-hover': this.props.hover,
      'table-condensed': this.props.condensed
    }, this.props.tableBodyClass);

    const unselectable = this.props.selectRow.unselectable || [];
    const isSelectRowDefined = this._isSelectRowDefined();
    const tableHeader = this.renderTableHeader(isSelectRowDefined);
    const inputType = this.props.selectRow.mode === Const.ROW_SELECT_SINGLE ? 'radio' : 'checkbox';
    const CustomComponent = this.props.selectRow.customComponent;

    const tableRows = this.props.data.map((data, r) => {
      rowId = r;
      if (this.props.nestedRows) {
        rowId = r === 0 ? 0 : rowId + r;
      }
      return mapTableRows(
        data, rowId, unselectable,
        isSelectRowDefined, inputType, CustomComponent,
        this
      );
    });

    if (tableRows.length === 0) {
      tableRows.push(
        <TableRow key='##table-empty##'>
          <td data-toggle='collapse'
              colSpan={ this.props.columns.length + (isSelectRowDefined ? 1 : 0) }
              className='react-bs-table-no-data'>
              { this.props.noDataText || Const.NO_DATA_TEXT }
          </td>
        </TableRow>
      );
    }

    return (
      <div ref='container'
        className={ classSet('react-bs-container-body', this.props.bodyContainerClass) }
        style={ this.props.style }>
        <table className={ tableClasses } ref='table'>
          { tableHeader }
          <tbody ref='tbody'>
            { tableRows }
          </tbody>
        </table>
      </div>
    );
  }

  renderTableHeader(isSelectRowDefined) {
    let selectRowHeader = null;

    if (isSelectRowDefined) {
      const style = {
        width: 30,
        minWidth: 30
      };
      if (!this.props.selectRow.hideSelectColumn) {
        selectRowHeader = (<col style={ style } key={ -1 }></col>);
      }
    }
    const isResizable = this.props.resizable;
    const theader = this.props.columns.map(function(column, i) {
      const style = {
        display: column.hidden ? 'none' : null
      };
      if (!isResizable && column.width) {
        const width = parseInt(column.width, 10);
        style.width = width;
        /** add min-wdth to fix user assign column width
        not eq offsetWidth in large column table **/
        style.minWidth = width;
      }
      column.className = column.resize ? column.className + ' resizable' : column.className;
      column.className = column.fixed ? column.className + ' fixed' : column.className;
      return (<col style={ style } key={ i } className={ column.className }></col>);
    });

    return (
      <colgroup ref='header'>
        { selectRowHeader }{ theader }
      </colgroup>
    );
  }

  handleRowMouseOut = (rowIndex, event) => {
    const targetRow = this.props.data[rowIndex];
    this.props.onRowMouseOut(targetRow, event);
  }

  handleRowMouseOver = (rowIndex, event) => {
    const targetRow = this.props.data[rowIndex];
    this.props.onRowMouseOver(targetRow, event);
  }

  handleRowClick = (rowIndex) => {
    let selectedRow;
    const { data, onRowClick } = this.props;
    data.forEach((row, i) => {
      if (i === rowIndex - 1) {
        selectedRow = row;
      }
    });
    const rowKey = selectedRow[this.props.keyField];
    if (this.props.expandableRow) {
      let expanding = this.state.expanding;
      if (this.state.expanding.indexOf(rowKey) > -1) {
        expanding = expanding.filter(k => k !== rowKey);
      } else {
        expanding.push(rowKey);
      }
      this.setState({ expanding }, () => {
        this.props.adjustHeaderWidth();
      });
    }
    onRowClick(selectedRow);
  }

  handleCaretClick = (rowDataId, childrenShown, callback) => {
    const { data } = this.props;
    const selectedRow = getSelectedRowById(data, rowDataId);
    const rowKey = selectedRow[this.props.keyField];

    if (this.props.nestedRows) {
      selectedRow._data_nesting.childrenShown = childrenShown;
      this.checkChildrenShown(rowKey, childrenShown);
    }
    if (this.props.onCaretClick) {
      this.props.onCaretClick(selectedRow, this.handleCaretClickCallback);
    }
    this.tableRowCallback = callback;
  }

  handleCaretClickCallback = (row) => {
    const rowKey = row[this.props.keyField];
    if (this.props.nestedRows) {
      row._data_nesting.childrenShown = true;
      this.checkChildrenShown(rowKey, true);
    }
  }

  addShown = (rowsChildren) => {
    rowsChildren.forEach((row) => {
      row.classList.add('shown');
    });
  }

  removeShown = (rowsChildren) => {
    rowsChildren.forEach((row) => {
      row.classList.remove('shown');
    });
  }

  checkChildrenShown = (rowKey, childrenShown) => {
    const rowsChildren = document.querySelectorAll(`[data-nesting-parent="${rowKey}"]`);
    const grandChildren = document.querySelectorAll(`[data-nesting-parent^="${rowKey}_"]`);
    if (this.tableRowCallback) this.tableRowCallback(rowKey, childrenShown);

    // this.toggleShown(rowsChildren);
    // this.toggleShown(grandChildren);
    if (childrenShown) {
      this.addShown(rowsChildren);
      this.addShown(grandChildren);
    } else {
      this.removeShown(rowsChildren);
      this.removeShown(grandChildren);
    }
  }

  handleRowDoubleClick = rowIndex => {
    let selectedRow;
    const { data, onRowDoubleClick } = this.props;
    data.forEach((row, i) => {
      if (i === rowIndex - 1) {
        selectedRow = row;
      }
    });
    onRowDoubleClick(selectedRow);
  }

  handleSelectRow = (rowIndex, isSelected, e) => {
    let selectedRow;
    const { data, onSelectRow } = this.props;
    data.forEach((row, i) => {
      if (i === rowIndex - 1) {
        selectedRow = row;
        return false;
      }
    });
    onSelectRow(selectedRow, isSelected, e);
  }

  handleSelectRowColumChange = (e, rowIndex) => {
    if (!this.props.selectRow.clickToSelect ||
      !this.props.selectRow.clickToSelectAndEditCell) {
      this.handleSelectRow(
        rowIndex + 1,
        e.currentTarget.checked,
        e);
    }
  }

  handleEditCell = (rowIndex, columnIndex, e) => {
    if (this._isSelectRowDefined()) {
      columnIndex--;
      if (this.props.selectRow.hideSelectColumn) columnIndex++;
    }
    rowIndex--;
    const stateObj = {
      currEditCell: {
        rid: rowIndex,
        cid: columnIndex
      }
    };

    if (this.props.selectRow.clickToSelectAndEditCell &&
        this.props.cellEdit.mode !== Const.CELL_EDIT_DBCLICK) {
      const selected = this.props.selectedRowKeys.indexOf(
        this.props.data[rowIndex][this.props.keyField]) !== -1;
      this.handleSelectRow(rowIndex + 1, !selected, e);
    }
    this.setState(stateObj);
  }

  handleCompleteEditCell = (newVal, rowIndex, columnIndex) => {
    this.setState({ currEditCell: null });
    if (newVal !== null) {
      this.props.cellEdit.__onCompleteEdit__(newVal, rowIndex, columnIndex);
    }
  }

  renderSelectRowColumn(selected, inputType, disabled, CustomComponent = null, rowIndex = null) {
    return (
      <TableColumn dataAlign='center'>
      { CustomComponent ?
        <CustomComponent type={ inputType } checked={ selected } disabled={ disabled }
          rowIndex={ rowIndex }
          onChange={ e=>this.handleSelectRowColumChange(e, rowIndex) }/> :
        <input type={ inputType } checked={ selected } disabled={ disabled }
          onChange={ e=>this.handleSelectRowColumChange(e, rowIndex) }/>
      }
      </TableColumn>
    );
  }

  _isSelectRowDefined() {
    return this.props.selectRow.mode === Const.ROW_SELECT_SINGLE ||
          this.props.selectRow.mode === Const.ROW_SELECT_MULTI;
  }
}
TableBody.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  striped: PropTypes.bool,
  bordered: PropTypes.bool,
  hover: PropTypes.bool,
  condensed: PropTypes.bool,
  keyField: PropTypes.string,
  selectedRowKeys: PropTypes.array,
  onRowClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onSelectRow: PropTypes.func,
  noDataText: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  style: PropTypes.object,
  tableBodyClass: PropTypes.string,
  bodyContainerClass: PropTypes.string,
  resizable: PropTypes.bool,
  nestedRows: PropTypes.bool,
  nestedRowsOptions: PropTypes.object,
  expandableRow: PropTypes.func,
  expandComponent: PropTypes.func,
  expandRowBgColor: PropTypes.string,
  adjustHeaderWidth: PropTypes.func,
  onCaretClick: PropTypes.func
};
export default TableBody;
