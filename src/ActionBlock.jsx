import React from "react";
import Button from "../../../../components/CustomButtons/Button";
import { ChevronRight, Clear, Edit } from "@material-ui/icons";
import { Modal, Grid, Typography, ClickAwayListener, Paper, Box, Popper } from "@material-ui/core";
import Card from "../../../../components/Card/Card";
import CardBody from "../../../../components/Card/CardBody";
import { renderArea } from "../../../../commons/FormControl/renderFields";
import motors from "../../../../../public/motors.png";
import autoTrader from "../../../../../public/touch-icon-ipad.png";
import { editCarThunk } from "../../../../reducers/vehicleInfoReducer";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";

const ActionBlock = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedVRM, setSelectedVRM] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);

  function handleDelete(event, vrm) {
    setAnchorEl(event.currentTarget);
    setSelectedVRM(vrm);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const handleEdit = () => {
    setEditMode(true);
  };
  const handleEditModeClose = () => {
    setEditMode(false);
  };
  const open = Boolean(anchorEl);
  var initialValues = {
    mileage: props.mileage,
    listPrice: props.listPrice
  };
  const editValues = (values) => {
    initialValues = {
      vrm: props.vrm,
      mileage: values.mileage !== undefined ? values.mileage : props.mileage,
      listPrice: values.listPrice !== undefined ? values.listPrice : props.price
    };
    console.log(values.mileage);
    console.log(values);
    props.updateCarDetails(values);
  };

  const ModalView = React.forwardRef((props, ref) => (
    <Modal
      open={editMode}
      ref={ref}
    >
      {props.children}
    </Modal>
  ));
  const icons = (provider) => {
    if (provider === "None") {
      return;
    }
    if (provider === "Motors") {
      return (
        <img src={motors} alt="Motors" style={{ height: 30, width: 30, minWidth: 30 }}/>
      );
    }
    if (provider === "AutoTrader") {
      return <img src={autoTrader} alt={"AutoTrader"} style={{ height: 30, width: 30, minWidth: 30 }}/>;
    }
  };
  const ref = React.createRef();
  return (
    <>
      {icons(props.provider)}
      <Button justIcon color={"info"} size={"sm"} href={`/report-list/${props.vrm}`}>
        <ChevronRight/>
      </Button>
      <Button justIcon color={"success"} size={"sm"} onClick={handleEdit}>
        <Edit/>
      </Button>
      <Button justIcon color={"danger"} size={"sm"} round={true}
              onClick={(event) => handleDelete(event, props.vrm)}>
        <Clear/>
      </Button>
      <>
        <Popper
          open={open}
          anchorEl={anchorEl}
        >

          <Box p={2}>
            <ClickAwayListener onClickAway={handleClose}>
              <Paper>
                <Typography align={"center"}>Delete Vehicle</Typography>
                <p style={{ color: "grey", fontSize: 12, textAlign: "center" }}>Are you sure?</p>
                <Grid container direction={"row"} justify={"center"}>
                  <Button size={"sm"} color={"transparent"} round onClick={handleClose}>
                    No
                  </Button>
                  <Button size={"sm"} color={"transparent"} round onClick={() => props.deleteCar(selectedVRM)}>
                    Yes
                  </Button>
                </Grid>
              </Paper>
            </ClickAwayListener>
          </Box>
        </Popper>

        <ModalView ref={ref}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Card style={{ width: 400 }}>
              <CardBody>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button justIcon
                          color={"rose"}
                          size={"sm"}
                          round
                          onClick={handleEditModeClose}
                  >
                    <Clear/>
                  </Button>
                </div>
                <div>
                  <EditFormFormRedux onSubmit={editValues}
                                     initialValues={{ initialValues }}
                                     {...props}/>
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalView>
      </>
    </>
  );
};
const EditCarForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit} autoComplete={"off"} noValidate>
      <Grid container justify={"center"} alignItems={"center"} direction={"column"}>
        <Grid container justify={"center"} direction={"row"} alignItems={"center"}>
          <p style={{ marginRight: 10 }}>Mileage</p>
          <Field
            name={"mileage"}
            component={renderArea}
            id="mileage"
            placeholder={"Mileage"}
          />
        </Grid>
        <Grid container justify={"center"} direction={"row"} alignItems={"center"}>
          <p style={{ marginRight: 28 }}>Price</p>
          <Field
            placeholder={"Price"}
            name={"listPrice"}
            component={renderArea}
            id="price"
          />
        </Grid>
        <Button type={"submit"}>Save</Button>
      </Grid>
    </form>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    initialValue: {
      mileage: ownProps.mileage,
      listPrice: ownProps.listPrice
    }
  };
}

let mapDispatchToProps = (dispatch) => {
  return {
    updateCarDetails: (values) => {
      dispatch(editCarThunk(values));
    }
  };
};
const EditFormFormRedux = reduxForm({ form: "EditForm", enableReinitialize: true }, mapStateToProps)(EditCarForm);
export default connect(null, mapDispatchToProps)(ActionBlock);