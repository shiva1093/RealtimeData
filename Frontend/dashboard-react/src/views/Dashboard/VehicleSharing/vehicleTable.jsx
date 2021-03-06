import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import RefreshIcon from '@material-ui/icons/Refresh';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { busHeader } from "./vehicleHeader"
import {GenericAPIHandler} from "../../../components/ApiHandler/genericApiHandler"
import LinearProgress from '@material-ui/core/LinearProgress';
import AddCircle from '@material-ui/icons/Lens';
import RemoveCircle from '@material-ui/icons/IndeterminateCheckBox';
import {config} from '../../../config/default.js'
import {sendmsg} from "../../../utils/webstomp";
function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}


class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;
        const columnData = busHeader;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {columnData.map(column => {
                        return (
                            <TableCell
                                key={column.id}
                                numeric={column.numeric}
                                padding={column.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === column.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={order}
                                        onClick={this.createSortHandler(column.id)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

let EnhancedTableToolbar = props => {
    const { numSelected, DeleteFunction, classes } = props;
    var select= [];
    Object.keys(numSelected).map(function(i) {
        select.push(numSelected[i]);
    })
    console.log("what is selected::::" + typeof(select) + "......"+ select.length);
    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {select.length > 0 ? (
                    <Typography color="inherit" variant="subheading">
                        {select.length} selected
                    </Typography>
                ) : (
                    <Typography variant="title" id="tableTitle">
                        Transport Sharing Dashboard
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {select.length > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon onClick={() => DeleteFunction(select)} />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="Filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 1,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    progress: {
        alignContent: 'center',
    },
    busVal: {
        width  : 100,
    },
});
const refreshIcon = {
    width: 40,
    top: 19,
    left: 34,
    positionAbsolute: true

}
class VehicleTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            order: 'ASC',
            orderBy: 'provider',
            isLoading: false,
            selected: [],
            busNames: [],
            data: [

            ],
            page: 0,
            totalElements:'',
            rowsPerPage: 5,
        };
    }

    componentDidMount() {
        this.ApiHandler()
    }

    ApiHandler(){
        GenericAPIHandler("http://localhost:9001/carConditons/pageSize="+this.state.rowsPerPage+"&pageNumber="+this.state.page+"&sortCriteria="+this.state.orderBy+"&sortType="+this.state.order).then((res) => {
            var results = res.data.content;
            var totalCount = res.data.totalElements;
            /*console.log(results)
            console.log('stateChange final callback')
            console.log(this.state.orderBy)
            console.log(this.state.order)*/
            this.setState({data: results, isLoading:true,totalElements:totalCount});
            this.props.vehicleRules(totalCount);
        })
    }
    RefreshFunction = () => {
        this.setState({isLoading:false});
        this.ApiHandler();
    }

    DeleteFunction = (select) => {
        const topic = config.topics.vehiclesharing;
        var len = select.length;
        var msg;
        for (var i = 0; i< len; i++){
            msg = {
                bindingID: select[i],
                command: 'REMOVE'
            }
            sendmsg(msg, topic);
            console.log("in delete function ::::::" + JSON.stringify(msg));
        }
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'DESC';

        if (this.state.orderBy === property && this.state.order === 'DESC') {
            order = 'ASC';
        }

        this.setState({ order, orderBy },() => {
            /*console.log(this.state.orderBy, 'orderBY');
            console.log(this.state.order, 'order');*/
            this.ApiHandler();
        });
    };

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState({ selected: this.state.data.map(n => n.conditionId) });
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        this.setState({ page }, () => {
            //console.log(this.state.page, 'pagestatechanged');
            this.ApiHandler();
        });

    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value }, () => {
            // console.log(this.state.rowsPerPage, 'rowsperpagestatechanged');
            this.ApiHandler();
        });

    };

    /* RefreshApiHandler(){
         GenericAPIHandler('https://my-json-server.typicode.com/shiva1093/APICall/transportsharingapi').then((res) => {
             var results = res.data;
             console.log(results)
             this.setState({data: results, isLoading:true});
             this.props.vehicleRules(results);
         })
     }*/

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    checkStatus = (props) => {
        if(props === true)
            return <AddCircle nativeColor="green"/>
        else
            return <AddCircle nativeColor="red"/>
    }
    render() {
        const { classes } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page,isLoading,totalElements } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        return (

            this.state.isLoading ?
                <Paper className={classes.root}>
                    <EnhancedTableToolbar DeleteFunction={this.DeleteFunction} numSelected={selected} />
                    <div style={refreshIcon}
                         onClick={this.RefreshFunction}>
                        <Tooltip title="Refresh">
                            <IconButton aria-label="Refresh">
                                <RefreshIcon/>
                            </IconButton></Tooltip>
                    </div>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={data.length}
                            />
                            {  <TableBody>
                                {data
                                //.sort(getSorting(order, orderBy))
                                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(n => {
                                        const isSelected = this.isSelected(n.conditionId);
                                        return (
                                            <TableRow
                                                hover
                                                onClick={event => this.handleClick(event, n.conditionId)}
                                                role="checkbox"
                                                aria-checked={isSelected}
                                                tabIndex={-1}
                                                key={n.conditionId}
                                                selected={isSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isSelected} />
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    {n.vehicleType}
                                                </TableCell>
                                                <TableCell numeric>{n.provider}</TableCell>
                                                <TableCell numeric>{n.lowerBound}</TableCell>
                                                <TableCell numeric>{n.upperBound}</TableCell>
                                                <TableCell numeric>
                                                    {this.checkStatus(n.status)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 49 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>}
                        </Table>
                    </div>
                    <TablePagination
                        component="div"
                        count={totalElements}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper> : <LinearProgress className={classes.progress}/>
        );
    }
}

VehicleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VehicleTable);
