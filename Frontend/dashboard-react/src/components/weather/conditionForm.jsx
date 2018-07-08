import React from "react";
import PropTypes from 'prop-types';
import { withStyles} from "material-ui";
import {Select, MenuItem, Input, InputLabel, FormControl} from 'material-ui';

import {
  Button
} from "../../components/baseItems";

import Maps from "../../views/Maps/Maps.jsx";

import weatherStyle from './style';
import {connect, sendmsg} from '../../utils/webstomp.js';
import uuidv1 from 'uuid/v1';

import { conditions } from './conditionInfo.js'
var catagory = conditions.catagory;
var catavalue = conditions.catavalue;
var condition = conditions.condition;

const mapsControlStyles = {
  width: 1040,
  paddingTop: 20
};

class ConditionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            catagory:catagory[0],
            cata: catavalue[catagory[0]],
            value: catavalue[catagory[0]][0],
            condition: condition[0],
            location: '',
            postion: {
              lat: '52.52',
              lon: '13.41'
            }
        }
        this.handleCatagoryChange = this.handleCatagoryChange.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.markermaps = this.markermaps.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
    }

    componentWillMount(){
      connect();
    }

    sendMsg(e) {
        e.preventDefault();
        console.log('sending message!!!');
        var uid = uuidv1();
        var msg = {
          bindingID: uid,
          setting:"",
          condition: [{
            catagory: this.state.catagory,
            catevalue: this.state.value,
            condition: this.state.condition,
            position: this.state.position,
          }],
          command: 'CREATE'
        }
        console.log("send messge:::::" + JSON.stringify(msg));
        global.conditions.push(msg);
        sendmsg(msg);
    }

    handleCatagoryChange = (event) => {
        var value = event.target.value
        this.setState({
          catagory: value,
          cata: catavalue[value],
          value: catavalue[value][0],
        });
        if(conditions.isCondition.find(item => {
            return item === value;
        })){
            this.setState({condition: 'is'})
        } else {
            this.setState({condition: '>'})
        }
      }
    onValueChange = (event) => {
      this.setState({
        [event.target.name]: event.target.value
      });
    }

    markermaps = (googleMap) => {
      var pos = JSON.stringify(googleMap.getPosition());
      pos = JSON.parse(pos);
      console.log('LatLngBounds of this :' + pos + "........" + pos.lat);
      this.setState({position: {
        lat: pos.lat,
        lon: pos.lng 
      }});
    }

    render() {
        const {classes} = this.props;

        return(
          <form className={classes.root} autoComplete="off" onSubmit={this.sendMsg}>
            <Button label="Submit"  color="info" type="submit">Create</Button>

            <FormControl className={classes.formControl}>
            <InputLabel htmlFor="catagory" className={classes.inputLabel} >Catagory</InputLabel>
            <Select className={classes.select}
                value={this.state.catagory}
                onChange={this.handleCatagoryChange}
                input={<Input name="catagory" id="catagory" />}
          >
            {conditions.catagory.map(item => {
              return(
                <MenuItem key={item} value={item}>{item}</MenuItem>
              )
            })}
            </Select>
          </FormControl>

          {conditions.isCondition.includes(this.state.catagory) ?
            <FormControl className={classes.formControl}>
            <InputLabel htmlFor="condition" className={classes.inputLabel} >Condition</InputLabel>
            <Select className={classes.select}
              value={this.state.condition}
              onChange={this.onValueChange}
              input={<Input name="condition" id="condition" />}
            >
            <MenuItem key={'is'} value={'is'}> is </MenuItem>
            </Select>
           </FormControl>
         :
           <FormControl className={classes.formControl}>
             <InputLabel htmlFor="condition" className={classes.inputLabel} >Condition</InputLabel>
             <Select className={classes.select}
               value={this.state.condition}
               onChange={this.onValueChange}
               input={<Input name="condition" id="condition" />}
             >
               {
                 conditions.condition.map(item => {
                   return (
                     <MenuItem key={item} value={item}>{item}</MenuItem>
                   )
                 })
               }
             </Select>
           </FormControl>
        }
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="value" className={classes.inputLabel}>Value</InputLabel>
          <Select className={classes.select}
            value={this.state.value}
            onChange={this.onValueChange}
            input={<Input name="value" id="value" />}
          >
          {
            this.state.cata.map(item=>{
              return(
                <MenuItem key={item} value={item}>{item}</MenuItem>
              )
            })
          }
          </Select>
        </FormControl>
        <FormControl style={mapsControlStyles} >
            <Maps markermaps={this.markermaps}/>
        </FormControl>
        
        </form>
        )
    }

}
ConditionForm.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(weatherStyle)(ConditionForm);