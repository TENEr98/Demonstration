import React from "react";
import PropTypes from "prop-types";
import { carListThunk } from "../../reducers/vehicleInfoReducer";
import { connect } from "react-redux";
import { ListCarsConnect } from "./TableCars/ContainerListCars";
import {
  Typography,
  Grid,
  Box,
  Icon,
  Snackbar,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import Button from "../../components/CustomButtons/Button";
import { compose } from "redux";
import { Assignment, ChevronRight, SearchIcon } from "@material-ui/icons";
import { cardTitle } from "../../assets/jss/material-kit-pro-react";
import { Field, reduxForm } from "redux-form";
import { renderField } from "../../commons/FormControl/renderFields";
import Card from "../../components/Card/Card";
import CircularIndeterminate from "../../commons/Circular/Circular";
import ModalWindow from "./ModalWindow";
import MenuCategories from "./MenuCategories/MenuCategories";
import Cookies from "universal-cookie";
import { withAuthRedirect } from "../../hoc/withAuthRedirect";
import { withRouter } from "react-router-dom";
import SearchResult from "./SearchResult/SearchResult";

const style = {
  cardTitle,
  textCenter: {
    fontSize: 60,
    textAlign: "center",
    color: "white",
  },
};

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.handle = this.handle.bind(this);
    this.handleLocal = this.handleLocal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.clearValues = this.clearValues.bind(this);
  }

  state = {
    bool: false,
    local: false,
    selectedView: 0,
    clicked: false,
    popOverOpen: false,
    redirect: false,
    vrm: null,
    tcAccepted: true,
    openModal: false,
    value: null,
    forceGetCars: false,
  };

  componentWillMount() {
    if (this.props.listCars.length === 0) {
      this.props.getListCars();
    }
    if (this.state.forceGetCars === true) {
      this.props.getListCars();
    }
    this.setState({ selectedView: this.props.match.params.index });
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    const cookie = new Cookies();
    if (
      nextProps.listCars.length != 0 &&
      nextProps.listCars != this.props.listCars
    ) {
      const currentCar = cookie.get("VRM");
      if (currentCar == null || currentCar == undefined) {
        this.setState({ local: false });
        return;
      }
      const data = nextProps.listCars;
      const res = data.some((item) => item.vrm === currentCar.vrm);
      if (res == true) {
        cookie.remove("VRM", { path: "/" });
      }
      this.setState({ local: !res });
    }
    if (nextProps.isExist != this.props.isExist && nextProps.isExist === true) {
      this.setState({
        popOverOpen: true,
        clicked: true,
      });
    }
  }

  handleClose(open) {
    this.setState({
      clicked: open,
    });
  }

  handleCloseModal(openModal) {
    this.setState({
      openModal,
    });
  }

  handle(selectedView) {
    this.setState({
      selectedView,
    });
  }

  handleLocal(local) {
    const cookie = new Cookies();
    if (cookie.get("VRM")) {
      this.setState({
        local: local,
      });
    }
  }

  clearValues(value) {
    this.setState({
      value: value,
    });
  }

  onAddCarDetails = (values) => {
    console.log(this.state.value);
    if (this.state.value !== null) {
      this.clearValues(null);
    }
    this.setState({
      openModal: true,
      value: values.vrm,
    });
  };

  onGetUrlImage = (values) => {
    const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(values.URL_image)) {
      if (
        values.URL_image.includes("motors.co.uk") ||
        values.URL_image.includes("autotrader.co.uk")
      ) {
        if (this.state.value !== null) {
          this.clearValues(null);
        }
        this.setState({
          openModal: true,
          value: values.URL_image,
        });
      }
    }
  };

  render() {
    const { classes } = this.props;
    console.log(this.props.listCars);
    return (
      <>
        {this.state.local == true ? (
          <ModalWindow local={this.handleLocal} />
        ) : null}
        {this.props.isFetching != undefined &&
        this.props.isFetching != false ? (
          <>
            <CircularIndeterminate />
          </>
        ) : (
          <>
            <Grid
              container
              direction={"row"}
              justify={"center"}
              alignItems={"baseline"}
            >
              <Typography variant={"h3"}>my shortlist</Typography>
              <AddCarFormRedux
                onSubmit={this.onAddCarDetails}
                {...this.props}
              />
            </Grid>
            <Grid container justify={"center"} alignItems={"baseline"}>
              <UrlImageFormRedux onSubmit={this.onGetUrlImage} />
            </Grid>
            {this.state.popOverOpen === true ? (
              <Snackbar
                open={this.state.clicked}
                autoHideDuration={6000}
                onClose={() => this.handleClose(false)}
                message={"You already have this car"}
              ></Snackbar>
            ) : null}

            <Grid container justify={"center"}>
              <Card
                style={{
                  boxSizing: "content-box",
                  width: 1000,
                }}
              >
                <Box m={2}>
                  <Grid
                    container
                    direction={"row"}
                    alignItems={"baseline"}
                    justify={"flex-start"}
                  >
                    <Box
                      width={70}
                      height={80}
                      bgcolor={"secondary.main"}
                      borderRadius={"borderRadius"}
                    >
                      <Grid container justify={"center"}>
                        <Icon className={classes.textCenter} fontSize={"large"}>
                          <Assignment fontSize={"large"} />
                        </Icon>
                      </Grid>
                    </Box>
                    <Box width={100}>
                      <Grid
                        container
                        justify={"center"}
                        direction={"column-reverse"}
                        alignItems={"center"}
                      >
                        Your Cars
                      </Grid>
                    </Box>
                    <Box m={1}>
                      <Grid container direction={"row"} justify={"center"}>
                        <MenuCategories
                          handle={this.handle}
                          selectedView={this.state.selectedView}
                        />
                      </Grid>
                    </Box>
                  </Grid>
                </Box>
                <Box m={2} style={{ height: 470 }}>
                  {this.props.listCars != null ? (
                    <ListCarsConnect
                      selectedView={this.state.selectedView}
                      data={this.props.listCars}
                    />
                  ) : (
                    <CircularIndeterminate />
                  )}
                </Box>
              </Card>
            </Grid>
            <>
              {this.state.openModal === true ? (
                <SearchResult
                  openModal={this.state.openModal}
                  values={this.state.value}
                  forGetCars={this.state.forGetCars}
                  handleCloseModal={this.handleCloseModal}
                />
              ) : null}
            </>
          </>
        )}
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    listCars: state.vehicleInfoPage.listCars,
    isFetching: state.loginPage.isFetching,
    status: state.loginPage.status,
    vrm: state.vehicleInfoPage.vrm,
    error: state.errorHandle.error,
    canRedirect: state.vehicleInfoPage.canRedirect,
    isExist: state.vehicleInfoPage.isExist,
  };
};
let mapDispatchToProps = (dispatch) => {
  return {
    getListCars: () => {
      return dispatch(carListThunk());
    },
  };
};
const required = (value) => (value ? undefined : "Please Enter VRM");
const requiredURL = (value) => (value ? undefined : "Please Enter URL");
const addVRM = (props) => {
  const useStyle = makeStyles({
    text: {
      width: 200,
    },
    input: {
      color: "black",
    },
  });
  const style = useStyle();
  const upper = (value) => value && value.toUpperCase();
  return (
    <form onSubmit={props.handleSubmit} autoComplete={"off"} noValidate>
      <Box m={6}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={5}
        >
          <ChevronRight />
          <Field
            className={style.text}
            name={"vrm"}
            component={renderField}
            placeholder="VRM HERE"
            id="enterVRM"
            validate={required}
            normalize={upper}
            InputProps={{
              className: style.input,
            }}
          />

          {props.listCars && props.listCars.length > 0 ? (
            <Button
              type={"submit"}
              block={false}
              label={"Add"}
              round
              color="danger"
              size="lg"
            >
              <SearchIcon />
              Add another{" "}
            </Button>
          ) : (
            <Button
              type={"submit"}
              block={false}
              round
              color="danger"
              size="lg"
            >
              <SearchIcon />
              Add{" "}
            </Button>
          )}
        </Grid>
      </Box>
    </form>
  );
};

addVRM.propTypes = {
  classes: PropTypes.object,
  size: PropTypes.oneOf(["sm", "lg"]),
  round: PropTypes.bool,
  block: PropTypes.bool,
};

const URLimage = (props) => {
  const useStyle = makeStyles({
    text: {
      width: 300,
    },
    input: {
      color: "black",
    },
  });

  const style = useStyle();
  return (
    <form onSubmit={props.handleSubmit} autoComplete={"off"} noValidate>
      <Box m={6}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={5}
        >
          <ChevronRight />
          <Field
            className={style.text}
            name={"URL_image"}
            component={renderField}
            placeholder="Paste AutoTrader or Motors Car link here"
            id="URL_image"
            validate={requiredURL}
            InputProps={{
              className: style.input,
            }}
          />

          <Button
            type={"submit"}
            block={false}
            label={"Add"}
            round
            color="danger"
            size="lg"
          >
            <SearchIcon />
            Look up{" "}
          </Button>
        </Grid>
      </Box>
    </form>
  );
};
const UrlImageFormRedux = reduxForm({ form: "urlImageInput" })(URLimage);
const AddCarFormRedux = reduxForm({ form: "vrmInput" })(addVRM);
export default compose(
  withAuthRedirect,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(style),
  withRouter
)(ProfilePage);