import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios'
import { tableList, getErrMessage, getMessage, resetVisible } from './actions';
import { makeSelectAddItem, makeSelectDeleteId, makeSelectUpdateItem } from './selectors';
import { ADD_ITEM, DELETE_ID, UPDATE_ITEM } from './constants';

export function* fetchTableData() {
    const requestURL = "http://localhost:8000/user";
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    };
    try {
      const info = yield call(axios, requestURL, options);
      yield put(tableList(info.data));
    } catch (err) {
      console.dir(err);
    }  
}
export function* createTableData() {
    const saveData = yield select(makeSelectAddItem());
    const requestURL = "http://localhost:8000/user";
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      data: (saveData)
    };
    try {
      const info = yield call(axios, requestURL, options);
      if (info){
        if (info.data.response==1){
          yield put(getMessage(info.data.message));
          yield fetchTableData();
          yield put(resetVisible());
        } else   if (info.data.response==2){
          yield put(getErrMessage(info.data.message));
        }
      }
      //yield put(tableList(info.data));
    } catch (err) {
      console.dir(err);
    }  
}
export function* updateTableData() {
    const updateDate = yield select(makeSelectUpdateItem());
    const requestURL = "http://localhost:8000/user";
    const options = {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
      },
      data: (updateDate)
    };
    try {
      const info = yield call(axios, requestURL, options);
      if (info){
        if (info.data.response==1){
          yield put(getMessage(info.data.message));
          yield fetchTableData();
          yield put(resetVisible());
        } else   if (info.data.response==2){
          yield put(getErrMessage(info.data.message));
        }
      }
      //yield put(tableList(info.data));
    } catch (err) {
      console.dir(err);
    }  
}
export function* deleteById() {
    const deleteId = yield select(makeSelectDeleteId());
    const requestURL = "http://localhost:8000/user";
    const options = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
      data: ({"id":deleteId})
    };
    try {
      const info = yield call(axios, requestURL, options);
      if (info){
        if (info.data.response==1){
          yield put(getMessage(info.data.message));
          yield fetchTableData();
        } else   if (info.data.response==2){
          yield put(getErrMessage(info.data.message));
        }
      }
      //yield put(tableList(info.data));
    } catch (err) {
      console.dir(err);
    }  
}
// Individual exports for testing
export default function* defaultSaga() {
  yield fetchTableData();
  yield takeLatest(ADD_ITEM, createTableData);
  yield takeLatest(UPDATE_ITEM, updateTableData);
  yield takeLatest(DELETE_ID, deleteById);
  // See example in containers/HomePage/saga.js
}
