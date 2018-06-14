import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import {
  MoreHoriz,
  Update,
  Train
} from "@material-ui/icons";

import { withStyles, Grid } from "material-ui";

import {
  StatsCard,
  RegularCard,
  Table,
  ItemGrid
} from "../../../components/baseItems";

import Header from './header.jsx';

class Car2go extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    return (
      <div>
        <Header />
        <Grid container>
        </Grid>
      </div>
    );
  }
}

Car2go.propTypes = {
  classes: PropTypes.object.isRequired
};

export default Car2go;
