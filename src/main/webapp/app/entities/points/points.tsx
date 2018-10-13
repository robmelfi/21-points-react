import './point.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table, Tooltip, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import {
  ICrudSearchAction,
  ICrudGetAllAction,
  TextFormat,
  getSortState,
  IPaginationBaseState,
  getPaginationItemsNumber,
  JhiPagination
} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
library.add(faCheck);
library.add(faTimes);

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './points.reducer';
import { IPoints } from 'app/shared/model/points.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IPointsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IPointsState extends IPaginationBaseState {
  search: string;
  tooltipOpen: boolean;
  popoverOpen: boolean;
}

export class Points extends React.Component<IPointsProps, IPointsState> {
  state: IPointsState = {
    search: '',
    tooltipOpen: false,
    popoverOpen: false,
    ...getSortState(this.props.location, ITEMS_PER_PAGE)
  };

  componentDidMount() {
    this.getEntities();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  togglePopover = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  clear = () => {
    this.props.getEntities();
    this.setState({
      search: ''
    });
  };

  handleSearch = event => this.setState({ search: event.target.value });

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.sortEntities()
    );
  };

  sortEntities() {
    this.getEntities();
    this.props.history.push(`${this.props.location.pathname}?page=${this.state.activePage}&sort=${this.state.sort},${this.state.order}`);
  }

  handlePagination = activePage => this.setState({ activePage }, () => this.sortEntities());

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  render() {
    const { pointsList, match, totalItems } = this.props;
    return (
      <div>
        <h2 id="points-heading">
          Points
        </h2>
        <Row>
          <Col sm="8">
            <h2 id="points-heading">
              Daily Points
            </h2>
          </Col>
          <Col sm="4">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup className="w-100 mr-1">
                  <AvInput type="text" name="search" value={this.state.search} onChange={this.handleSearch} placeholder="Search" />
                  <Button className="input-group-addon">
                    <FontAwesomeIcon icon="check" />
                  </Button>&nbsp;
                  <Button type="reset" className="input-group-addon" onClick={this.clear}>
                    <FontAwesomeIcon icon="trash" />
                  </Button>&nbsp;
                  <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
                    <FontAwesomeIcon icon="plus" />
                  </Link>
                  <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="jh-create-entity" toggle={this.toggleTooltip}>
                    Add Points
                  </Tooltip>
                </InputGroup>
              </AvGroup>
            </AvForm>
          </Col>
        </Row>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={this.sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('date')}>
                  Date <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('excercise')}>
                  Excercise <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('meals')}>
                  Meals <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('alcohol')}>
                  Alcohol <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={this.sort('notes')}>
                  Notes <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  User <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pointsList.map((points, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${points.id}`} color="link" size="sm">
                      {points.id}
                    </Button>
                  </td>
                  <td>
                    <TextFormat type="date" value={points.date} format={APP_LOCAL_DATE_FORMAT} />
                  </td>
                  <td className="text-center">
                    { points.excercise ?
                      <i><FontAwesomeIcon icon={faCheck} className="text-success"/></i>
                      : <i><FontAwesomeIcon icon={faTimes} className="text-danger"/></i> }
                  </td>
                  <td className="text-center">
                    { points.meals ?
                      <i><FontAwesomeIcon icon={faCheck} className="text-success"/></i>
                      : <i><FontAwesomeIcon icon={faTimes} className="text-danger"/></i> }
                  </td>
                  <td className="text-center">
                    { points.alcohol ?
                      <i><FontAwesomeIcon icon={faCheck} className="text-success"/></i>
                      : <i><FontAwesomeIcon icon={faTimes} className="text-danger"/></i> }
                  </td>
                  <td>
                    <div>
                      <div className="truncate" id="Popover1" onClick={this.togglePopover}>{points.notes}</div>
                      <Popover placement="right" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.togglePopover}>
                        <PopoverBody>{points.notes}</PopoverBody>
                      </Popover>
                    </div>
                  </td>
                  <td>{points.userLogin ? points.userLogin : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${points.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${points.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${points.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Row className="justify-content-center">
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, this.state.itemsPerPage)}
            activePage={this.state.activePage}
            onSelect={this.handlePagination}
            maxButtons={5}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ points }: IRootState) => ({
  pointsList: points.entities,
  totalItems: points.totalItems
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Points);
