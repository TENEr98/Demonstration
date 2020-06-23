import ActionBlock from "../../CommonTable/ActionBlock";
import { tableVRM } from "../../CommonTable/TableVRM";
import { deleteVRMThunk } from "../../../../../reducers/vehicleInfoReducer";
import { connect } from "react-redux";
import React from "react";
import { CellMeasurer, AutoSizer, MultiGrid } from "react-virtualized/dist/es";
import CellMeasurerCache from "react-virtualized/dist/es/CellMeasurer/CellMeasurerCache";
import Button from "../../../../../components/CustomButtons/Button";
import { ArrowDownward, ArrowUpward, ImportExport, InfoOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: "none"
  },
  paper: {
    padding: theme.spacing(1)
  }
}));
const Identity = (props) => {
  const classes = useStyles();
  let component = (vrm, provider, deleteFunc) => <ActionBlock vrm={vrm} provider={provider} deleteCar={deleteFunc}/>;
  let list = props.data;
  const [table, setTable] = React.useState({ active: 0, index: 0, rows: null });
  const [anchorEl, setAnchorEl] = React.useState({
    nameField: null,
    open: false,
    id: 0
  });
  const onOpenPopover = (event, id) => {
    setAnchorEl({ nameField: event, id: id, open: true });
  };
  const onCLosePopover = () => {
    setAnchorEl({ nameField: null, id: 0, open: false });
  };

  function getTableData(column, index) {
    switch (column) {
      /*     case 0: {
             if (index === 1) {
               return props.data.sort((a, b) => a.identity.dvlaEngineNumber - b.identity.dvlaEngineNumber);

             } else if (index === 2) {
               return props.data.sort((a, b) => b.identity.dvlaEngineNumber - a.identity.dvlaEngineNumber);
             }
             break;
           }*/
      case 0: {
        if (index === 1) {
          return props.data.sort((a, b) => a.identity.dvlaVIN - b.identity.dvlaVIN);

        } else if (index === 2) {
          return props.data.sort((a, b) => b.identity.dvlaVIN - a.identity.dvlaVIN);
        }
        break;
      }
      case 1: {
        if (index === 1) {
          return props.data.sort((a, b) => a.identity.dvlaEngineNumber - b.identity.dvlaEngineNumber);

        } else if (index === 2) {
          return props.data.sort((a, b) => b.identity.dvlaEngineNumber - a.identity.dvlaEngineNumber);
        }
        break;
      }
      case 2: {
        if (index === 1) {
          return props.data.sort(function(a, b) {
            if (a.identity.smmtCountryOfOrigin < b.identity.smmtCountryOfOrigin) return -1;
            return 0;
          });
        } else if (index === 2) {
          return props.data.sort(function(a, b) {
            if (a.identity.smmtCountryOfOrigin > b.identity.smmtCountryOfOrigin) return -1;
            return 0;
          });
        }
        break;
      }
      default: {
        return props.data;
      }
    }
  }

  function handleOnButtonClick(column) {

    let idx = table.index;
    if (column !== table.active) {
      idx = 1;
    } else {
      if (idx === 0 || idx > 1)
        idx = 1;
      else if (idx === 1)
        idx = 2;
    }
    const _rows = getTableData(column, idx);
    setTable({ active: column, index: idx, rows: _rows });
  }

  const header = [
    "VRM Make Model",
    "Actions",
    /*  <Button simple color={"github"} size={"sm"}
              style={{ padding: 0, margin: 0, fontSize: 14 }}
              onClick={() => handleOnButtonClick(0)}>
        {(table.index !== 1 || table.index !== 2) && table.index === 0 || table.active !== 0 ? <ImportExport/> : null}
        {table.index === 1 && table.index !== 0 && table.active === 0 ? <ArrowUpward/> : null}
        {table.index === 2 && table.index !== 0 && table.active === 0 ? <ArrowDownward/> : null}
        Engine Number
        <p aria-owns={anchorEl.open ? `${anchorEl.id}` : undefined}
           aria-haspopup="true"
           onMouseEnter={(event) => onOpenPopover(event.currentTarget, 1)}
           onMouseLeave={onCLosePopover}>
          <InfoOutlined/>
        </p>
      </Button>,*/
    <Button simple color={"github"} size={"sm"}
            style={{ padding: 0, margin: 0, fontSize: 14 }}
            onClick={() => handleOnButtonClick(1)}>
      {(table.index !== 1 || table.index !== 2) && table.index === 0 || table.active !== 1 ? <ImportExport/> : null}
      {table.index === 1 && table.index !== 0 && table.active === 1 ? <ArrowUpward/> : null}
      {table.index === 2 && table.index !== 0 && table.active === 1 ? <ArrowDownward/> : null}
      VIN
      <p aria-owns={anchorEl.open ? `${anchorEl.id}` : undefined}
         aria-haspopup="true"
         onMouseEnter={(event) => onOpenPopover(event.currentTarget, 2)}
         onMouseLeave={onCLosePopover}>
        <InfoOutlined/>
      </p>
    </Button>,
    <Button simple color={"github"} size={"sm"}
            style={{ padding: 0, margin: 0, fontSize: 14 }}
            onClick={() => handleOnButtonClick(2)}>
      {(table.index !== 1 || table.index !== 2) && table.index === 0 || table.active !== 2 ? <ImportExport/> : null}

      {table.index === 1 && table.index !== 0 && table.active === 2 ? <ArrowUpward/> : null}
      {table.index === 2 && table.index !== 0 && table.active === 2 ? <ArrowDownward/> : null}
      Engine Number
      <p aria-owns={anchorEl.open ? `${anchorEl.id}` : undefined}
         aria-haspopup="true"
         onMouseEnter={(event) => onOpenPopover(event.currentTarget, 3)}
         onMouseLeave={onCLosePopover}>
        <InfoOutlined/>
      </p>
    </Button>,
    <Button simple color={"github"} size={"sm"}
            style={{ padding: 0, margin: 0, fontSize: 14 }}
            onClick={() => handleOnButtonClick(3)}>
      {(table.index !== 1 || table.index !== 2) && table.index === 0 || table.active !== 3 ? <ImportExport/> : null}
      {table.index === 1 && table.index !== 0 && table.active === 3 ? <ArrowUpward/> : null}
      {table.index === 2 && table.index !== 0 && table.active === 3 ? <ArrowDownward/> : null}
      Country of Origin
    </Button>

  ];

  const contentList = new Array(list.length + 1);

  contentList[0] = header;

  list.map((el, index) => {

    contentList[index + 1] = [

      tableVRM(el.vrm, el.make, el.model),
      component(el.vrm, el.provider, () => props.deleteCar(el.vrm)),
      /*`${el.identity.dvlaEngineNumber} (DVLA)`,*/
      `${el.identity.dvlaVIN} (DVLA)`,
      `${el.identity.dvlaEngineNumber} (DVLA)`,
      `${el.identity.smmtCountryOfOrigin} (SMMT)`

    ];
  });

  const STYLE = {
    border: "1px solid #ddd"
  };
  const STYLE_BOTTOM_LEFT_GRID = {
    borderRight: "2px solid #aaa",
    backgroundColor: "#f7f7f7"
  };
  const STYLE_TOP_LEFT_GRID = {
    borderBottom: "2px solid #aaa",
    borderRight: "2px solid #aaa",
    fontWeight: "bold"
  };
  const STYLE_TOP_RIGHT_GRID = {
    borderBottom: "2px solid #aaa",
    fontWeight: "bold"
  };
  const configTable = {
    fixedColumnCount: 2,
    fixedRowCount: 1,
    scrollToColumn: 0,
    scrollToRow: 0
  };

  const cache = new CellMeasurerCache({

    defaultWidth: 150,
    fixedWidth: true,
    fixedHeight: false
  });

  function _cellRenderer({ columnIndex, key, rowIndex, parent, style }) {

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div style={{
          ...style,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
          borderBottom: "2px solid #eee",
          borderRight: "2px solid #eee"
        }}>
          {contentList[rowIndex][columnIndex]}
        </div>


      </CellMeasurer>
    );
  }

  return (
    <>

      <AutoSizer disableHeight>
        {({ width }) => (
          <MultiGrid
            {...configTable}
            cellRenderer={_cellRenderer}
            columnWidth={cache.columnWidth}
            columnCount={contentList[0].length}
            enableFixedColumnScroll
            enableFixedRowScroll
            height={450}
            rowHeight={cache.rowHeight}
            rowCount={contentList.length}
            style={STYLE}
            styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
            styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
            styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
            width={width}
            hideTopRightGridScrollbar
            hideBottomLeftGridScrollbar
          />
        )}
      </AutoSizer>
      <Popover
        id={`${anchorEl.id}`}
        className={classes.popover}
        classes={{
          paper: classes.paper
        }}
        open={anchorEl.open}
        anchorEl={anchorEl.nameField}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        onClose={onCLosePopover}
        disableRestoreFocus
      >
        {anchorEl.id == 1 ?
          <Typography style={{ maxWidth: 150 }}>Unique engine number given by the manufacturer
          </Typography> : null
        }
        {anchorEl.id == 2 ?
          <Typography style={{ maxWidth: 150 }}>The Vehicle Identification Number as Allocated
            to the Vehicle by the Original Vehicle Manufacturer (VIN).
            This can be found on V5C or on specific places around the car
            (i.e. engine bay/window)</Typography> : null
        }
        {anchorEl.id == 3 ?
          <Typography style={{ maxWidth: 150 }}>Manufacturer Country of Origin (final plant assembly).
          </Typography> : null
        }


      </Popover>
    </>
  );
};

let mapDispatchToProps = dispatch => {
  return {
    deleteCar: (vrm) => {
      return dispatch(deleteVRMThunk(vrm));
    }
  };
};
export default connect(null, mapDispatchToProps)(Identity);