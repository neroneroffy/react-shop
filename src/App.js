import React, { Component } from 'react';
import {HashRouter} from 'react-router-dom';
import './App.css';
import RouterMap from './router/router-map';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import createBrowserHistory from 'history/createBrowserHistory';
import { get } from './fetch/get';
import { API } from './constants/API';
import { openId } from './util/openId';
const store = configureStore();
const history = createBrowserHistory();


class App extends Component {
    constructor(props){
        super(props);
        this.state={
            isLoading:false,
            openId:openId(document.cookie)
        }
    }
     componentWillMount(){
        //console.log(this.state.openId)
        //document.cookie="eshop_session_cookie_key=oCEuiwP0grBfdix30MKCJssi9-yE;path=/";//console.log(openId(document.cookie))
        //const userOpenId = JSON.parse(openId(document.cookie));

     };
     componentDidMount(){
         console.log(`${API}/userinfo/${this.state.openId}`)
         get(`${API}/userinfo/${this.state.openId}`).then(res=>{
             return res.json()
         }).then(data=>{
             console.log(data.cookieModel);
             if(data.result){
                 localStorage.setItem('userData',JSON.stringify(data.cookieModel));
                 this.setState({
                     isLoading:true
                 });
             }
         })
     }
  render() {
          let ua = navigator.userAgent.toLowerCase();
          if(ua.match(/MicroMessenger/i)=="micromessenger") {
              return (
                  <div>
                      {
                          this.state.isLoading?
                              <Provider store={store}>
                                  <HashRouter className="App" history={history}>
                                      <RouterMap/>
                                  </HashRouter>
                              </Provider>
                              :
                              ""
                      }
                  </div>
          )} else {
                alert('请使用微信浏览');
             return false
          }

  }
}

export default App;

///api/commission/orderItem/list
