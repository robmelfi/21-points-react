
import React from 'react';
import { connect } from 'react-redux';

import { Container, Row, Col, ButtonGroup, Button } from 'reactstrap';
import BigCalendar from 'react-big-calendar';

import moment from 'moment';

import './history.scss';
import { IRootState } from 'app/shared/reducers';
import { getPointsbyMonths } from 'app/entities/points/points.reducer';

import {
  endOfMonth,
  format
} from 'date-fns';

// TODO: FIX this warning
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

export interface IHistoryProps extends StateProps, DispatchProps { }

export interface IHistoryState {
  monthIsActive: boolean;
  weekIsActive: boolean;
  dayIsActive: boolean;
}

export class History extends React.Component<IHistoryProps, IHistoryState> {

  state: IHistoryState = {
    monthIsActive: false,
    weekIsActive: false,
    dayIsActive: false
  };

  componentDidMount() {
    this.getPoints(this.getMonthFromDate(new Date()));
  }

  getPoints(month) {
    this.props.getPointsbyMonths(month);
  }

  onNavigateUpdate = month => {
    this.getPoints(this.getMonthFromDate(month));
  };

  getMonthFromDate(date) {
    const monthEnd = endOfMonth(date);
    const month = format(monthEnd, 'YYYY-MM');
    return month;
  }

  render() {

    const { pointsByMonths } = this.props;

    const customEventPropGetter = () => ({ className: 'event' });

    const CustomToolbar = toolbar => {

      const goToBack = () => {
        toolbar.onNavigate(BigCalendar.Navigate.PREVIOUS);
      };

      const goToNext = () => {
        toolbar.onNavigate(BigCalendar.Navigate.NEXT);
      };

      const goToCurrent = () => {
        toolbar.onNavigate(BigCalendar.Navigate.TODAY);
      };

      const goToWeekView = () => {
        toolbar.onView(BigCalendar.Views.WEEK);
        this.setState({
          monthIsActive: false,
          weekIsActive: true,
          dayIsActive: false
        });
      };

      const goToMonthView = () => {
        toolbar.onView(BigCalendar.Views.MONTH);
        this.setState({
          monthIsActive: true,
          weekIsActive: false,
          dayIsActive: false
        });
      };

      const goToDayView = () => {
        toolbar.onView(BigCalendar.Views.DAY);
        this.setState({
          monthIsActive: false,
          weekIsActive: false,
          dayIsActive: true
        });
      };

      const label = () => {
        return (
          <span>{toolbar.label}</span>
        );
      };

      return(
        <div className="mb-3 d-flex justify-content-between">
          <div className="d-flex flex-column align-items-center">
            <ButtonGroup>
              <Button color="primary" onClick={goToBack}>&#8249;</Button>
              <Button outline color="secondary" onClick={goToCurrent}>today</Button>
              <Button color="primary" onClick={goToNext}>&#8250;</Button>
            </ButtonGroup>
          </div>
          <div className="d-flex flex-row align-items-center lead">
            {label()}
          </div>
          <div className="d-flex flex-column justify-content-end">
            <ButtonGroup>
              <Button active={this.state.monthIsActive} color="primary" onClick={goToMonthView}>Month</Button>
              <Button active={this.state.weekIsActive} color="primary" onClick={goToWeekView}>Week</Button>
              <Button active={this.state.dayIsActive} color="primary" onClick={goToDayView}>Day</Button>
            </ButtonGroup>
          </div>
        </div>
      );
    };

    return (
      <Container className="calendar">
        <BigCalendar
          events={pointsByMonths}
          slots={60}
          defaultDate={new Date()}
          showMultiDayTimes
          localizer={localizer}
          style={{ height: '75vh' }}
          components={{
            toolbar: CustomToolbar
          }}
          onNavigate={ this.onNavigateUpdate }
          eventPropGetter={ customEventPropGetter }
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ points }: IRootState) => ({
  pointsByMonths: points.pointsByMonths
});

const mapDispatchToProps = {
  getPointsbyMonths
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History);
