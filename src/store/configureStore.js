/**
 * Created by web前端 on 2017/8/17.
 */
import { createStore } from 'redux';
import rootReducer from '../reducers/index';


export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState,
        // 触发 redux-devtools
        window.devToolsExtension ? window.devToolsExtension() : undefined
    );
    return store
}