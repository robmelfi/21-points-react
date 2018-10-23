import axios from 'axios';
import {
  ICrudSearchAction,
  parseHeaderForLinks,
  loadMoreDataWhenScrolled,
  ICrudGetAction,
  ICrudGetAllAction,
  ICrudPutAction,
  ICrudDeleteAction
} from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IWeigth, defaultValue } from 'app/shared/model/weigth.model';
import { defaultValue as defaultWChart } from 'app/shared/model/weigth-chart';

import moment from 'moment';

export const ACTION_TYPES = {
  SEARCH_WEIGTHS: 'weigth/SEARCH_WEIGTHS',
  FETCH_WEIGTH_LIST: 'weigth/FETCH_WEIGTH_LIST',
  FETCH_WEIGTH: 'weigth/FETCH_WEIGTH',
  FETCH_WEIGTH_LAST_30_DAYS: 'weigth/FETCH_WEIGTH_LAST_30_DAYS',
  CREATE_WEIGTH: 'weigth/CREATE_WEIGTH',
  UPDATE_WEIGTH: 'weigth/UPDATE_WEIGTH',
  DELETE_WEIGTH: 'weigth/DELETE_WEIGTH',
  RESET: 'weigth/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWeigth>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  wChart: defaultWChart
};

export type WeigthState = Readonly<typeof initialState>;

// Reducer

export default (state: WeigthState = initialState, action): WeigthState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_WEIGTHS):
    case REQUEST(ACTION_TYPES.FETCH_WEIGTH_LIST):
    case REQUEST(ACTION_TYPES.FETCH_WEIGTH):
    case REQUEST(ACTION_TYPES.FETCH_WEIGTH_LAST_30_DAYS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_WEIGTH):
    case REQUEST(ACTION_TYPES.UPDATE_WEIGTH):
    case REQUEST(ACTION_TYPES.DELETE_WEIGTH):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_WEIGTHS):
    case FAILURE(ACTION_TYPES.FETCH_WEIGTH_LIST):
    case FAILURE(ACTION_TYPES.FETCH_WEIGTH):
    case FAILURE(ACTION_TYPES.CREATE_WEIGTH):
    case FAILURE(ACTION_TYPES.UPDATE_WEIGTH):
    case FAILURE(ACTION_TYPES.DELETE_WEIGTH):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_WEIGTHS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_WEIGTH_LIST):
      const links = parseHeaderForLinks(action.payload.headers.link);
      return {
        ...state,
        links,
        loading: false,
        totalItems: action.payload.headers['x-total-count'],
        entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links)
      };
    case SUCCESS(ACTION_TYPES.FETCH_WEIGTH):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_WEIGTH):
    case SUCCESS(ACTION_TYPES.UPDATE_WEIGTH):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_WEIGTH):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case SUCCESS(ACTION_TYPES.FETCH_WEIGTH_LAST_30_DAYS):
      return {
        ...state,
        loading: false,
        wChart: processWeigthReading(action.payload.data)
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const processWeigthReading = wReading => {
  const weigthChart = defaultWChart;
  if (wReading.weighIns.length) {
    weigthChart.data = [];
    weigthChart.title = wReading.period;
    weigthChart.yAxis.label = 'Weigth';
    wReading.weighIns.forEach(item => {
      const d = { timestamp: moment(item.timestamp).format('MMM DD'), w: item.weight };
      weigthChart.data.unshift(d);
    });
    wReading.readings.length <= 10 ? weigthChart.interval = 0 : weigthChart.interval = 4;
  }
  return weigthChart;
};

const apiUrl = 'api/weigths';
const apiSearchUrl = 'api/_search/weigths';

// Actions

export const getSearchEntities: ICrudSearchAction<IWeigth> = query => ({
  type: ACTION_TYPES.SEARCH_WEIGTHS,
  payload: axios.get<IWeigth>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<IWeigth> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_WEIGTH_LIST,
    payload: axios.get<IWeigth>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IWeigth> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_WEIGTH,
    payload: axios.get<IWeigth>(requestUrl)
  };
};

export const getEntitiesLast30Days = () => {
  const requestUrl = `api/weight-by-days/30`;
  return {
    type: ACTION_TYPES.FETCH_WEIGTH_LAST_30_DAYS,
    payload: axios.get(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IWeigth> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WEIGTH,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const updateEntity: ICrudPutAction<IWeigth> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_WEIGTH,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IWeigth> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_WEIGTH,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
