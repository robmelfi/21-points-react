import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IPoints, defaultValue } from 'app/shared/model/points.model';

export const ACTION_TYPES = {
  SEARCH_POINTS: 'points/SEARCH_POINTS',
  FETCH_POINTS_LIST: 'points/FETCH_POINTS_LIST',
  FETCH_POINTS: 'points/FETCH_POINTS',
  CREATE_POINTS: 'points/CREATE_POINTS',
  UPDATE_POINTS: 'points/UPDATE_POINTS',
  DELETE_POINTS: 'points/DELETE_POINTS',
  RESET: 'points/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPoints>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type PointsState = Readonly<typeof initialState>;

// Reducer

export default (state: PointsState = initialState, action): PointsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_POINTS):
    case REQUEST(ACTION_TYPES.FETCH_POINTS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_POINTS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_POINTS):
    case REQUEST(ACTION_TYPES.UPDATE_POINTS):
    case REQUEST(ACTION_TYPES.DELETE_POINTS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_POINTS):
    case FAILURE(ACTION_TYPES.FETCH_POINTS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_POINTS):
    case FAILURE(ACTION_TYPES.CREATE_POINTS):
    case FAILURE(ACTION_TYPES.UPDATE_POINTS):
    case FAILURE(ACTION_TYPES.DELETE_POINTS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_POINTS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_POINTS_LIST):
      return {
        ...state,
        loading: false,
        totalItems: action.payload.headers['x-total-count'],
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_POINTS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_POINTS):
    case SUCCESS(ACTION_TYPES.UPDATE_POINTS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_POINTS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/points';
const apiSearchUrl = 'api/_search/points';

// Actions

export const getSearchEntities: ICrudSearchAction<IPoints> = query => ({
  type: ACTION_TYPES.SEARCH_POINTS,
  payload: axios.get<IPoints>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<IPoints> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_POINTS_LIST,
    payload: axios.get<IPoints>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IPoints> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_POINTS,
    payload: axios.get<IPoints>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IPoints> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_POINTS,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPoints> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_POINTS,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPoints> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_POINTS,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
