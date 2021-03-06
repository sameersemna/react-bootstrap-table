import React, { Component, PropTypes } from 'react';
import Const from './Const';

class TableColumn extends Component {

  constructor(props) {
    super(props);
  }
  /* eslint no-unused-vars: [0, { "args": "after-used" }] */
  shouldComponentUpdate(nextProps, nextState) {
    const { children } = this.props;
    let shouldUpdated = this.props.width !== nextProps.width
      || this.props.className !== nextProps.className
      || this.props.hidden !== nextProps.hidden
      || this.props.fixed !== nextProps.fixed
      || this.props.dataAlign !== nextProps.dataAlign
      || typeof children !== typeof nextProps.children
      || ('' + this.props.onEdit).toString() !== ('' + nextProps.onEdit).toString();

    if (shouldUpdated) {
      return shouldUpdated;
    }

    if (typeof children === 'object' && children !== null && children.props !== null) {
      if (children.props.type === 'checkbox' || children.props.type === 'radio') {
        shouldUpdated = shouldUpdated ||
          children.props.type !== nextProps.children.props.type ||
          children.props.checked !== nextProps.children.props.checked ||
          children.props.disabled !== nextProps.children.props.disabled;
      } else {
        shouldUpdated = true;
      }
    } else {
      shouldUpdated = shouldUpdated || children !== nextProps.children;
    }

    if (shouldUpdated) {
      return shouldUpdated;
    }

    if (!(this.props.cellEdit && nextProps.cellEdit)) {
      return false;
    } else {
      return shouldUpdated
        || this.props.cellEdit.mode !== nextProps.cellEdit.mode;
    }
  }

  handleCellEdit = e => {
    if (this.props.cellEdit.mode === Const.CELL_EDIT_DBCLICK) {
      if (document.selection && document.selection.empty) {
        document.selection.empty();
      } else if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
      }
    }
    this.props.onEdit(
      this.props.rIndex + 1,
      e.currentTarget.cellIndex,
      e);
  }

  caretClick = e => {
    // console.dir(this.props);
  }

  render() {
    const {
      children,
      columnTitle,
      colSpan,
      dataAlign,
      fixed,
      hidden,
      cellEdit
    } = this.props;

    const tdStyle = {
      textAlign: dataAlign,
      display: hidden ? 'none' : null
    };

    const opts = {};

    if (cellEdit) {
      if (cellEdit.mode === Const.CELL_EDIT_CLICK) {
        opts.onClick = this.handleCellEdit;
      } else if (cellEdit.mode === Const.CELL_EDIT_DBCLICK) {
        opts.onDoubleClick = this.handleCellEdit;
      }
    }
    return (
      <td style={ tdStyle }
          title={ columnTitle }
          className={ fixed && 'fixed' }
          colSpan={ colSpan }
          { ...opts }>
        { this.props.nestedRowsOptions
          && this.props.nestedRowsOptions.showCaret
          && this.props.colNo === 0
          && <span className='caret-right' onClick={ this.caretClick }></span> }
        { this.props.nestedRowsOptions
          && this.props.nestedRowsOptions.showCaret
          && this.props.colNo === 0
          && <span className='caret-loading'>L</span> }
        { typeof children === 'boolean' ? children.toString() : children }
      </td>
    );
  }
}
TableColumn.propTypes = {
  colNo: PropTypes.number,
  nestedRows: PropTypes.bool,
  nestedRowsOptions: PropTypes.object,
  rIndex: PropTypes.number,
  dataAlign: PropTypes.string,
  fixed: PropTypes.bool,
  hidden: PropTypes.bool,
  className: PropTypes.string,
  columnTitle: PropTypes.string,
  colSpan: PropTypes.number,
  children: PropTypes.node
};

TableColumn.defaultProps = {
  dataAlign: 'left',
  fixed: false,
  hidden: false,
  className: ''
};
export default TableColumn;
