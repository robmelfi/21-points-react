import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IPreferences, defaultValue } from 'app/shared/model/preferences.model';

export const ACTION_TYPES = {
  SEARCH_PREFERENCES: 'preferences/SEARCH_PREFERENCES',
  FETCH_PREFERENCES_LIST: 'preferences/FETCH_PREFERENCES_LIST',
  FETCH_PREFERENCES: 'preferences/FETCH_PREFERENCES',
  CREATE_PREFERENCES: 'preferences/CREATE_PREFERENCES',
  UPDATE_PREFERENCES: 'preferences/UPDATE_PREFERENCES',
  DELETE_PREFERENCES: 'preferences/DELETE_PREFERENCES',
  RESET: 'preferences/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IPreferences>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type PreferencesState = Readonly<typeof initialState>;

// Reducer

export default (state: PreferencesState = initialState, action): PreferencesState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_PREFERENCES):
    case REQUEST(ACTION_TYPES.FETCH_PREFERENCES_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PREFERENCES):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_PREFERENCES):
    case REQUEST(ACTION_TYPES.UPDATE_PREFERENCES):
    case REQUEST(ACTION_TYPES.DELETE_PREFERENCES):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_PREFERENCES):
    case FAILURE(ACTION_TYPES.FETCH_PREFERENCES_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PREFERENCES):
    case FAILURE(ACTION_TYPES.CREATE_PREFERENCES):
    case FAILURE(ACTION_TYPES.UPDATE_PREFERENCES):
    case FAILURE(ACTION_TYPES.DELETE_PREFERENCES):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PREFERENCES):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_PREFERENCES_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_PREFERENCES):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_PREFERENCES):
    case SUCCESS(ACTION_TYPES.UPDATE_PREFERENCES):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_PREFERENCES):
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

const apiUrl = 'api/preferences';
const apiSearchUrl = 'api/_search/preferences';

// Actions

export const getSearchEntities: ICrudSearchAction<IPreferences> = query => ({
  type: ACTION_TYPES.SEARCH_PREFERENCES,
  payload: axios.get<IPreferences>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<IPreferences> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PREFERENCES_LIST,
  payload: axios.get<IPreferences>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IPreferences> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PREFERENCES,
    payload: axios.get<IPreferences>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IPreferences> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PREFERENCES,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IPreferences> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PREFERENCES,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IPreferences> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PREFERENCES,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
