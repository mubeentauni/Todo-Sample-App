import alt from '../lib/alt';
import UserActions from '../actions/UserActions';
import CONSTANTS from '../utils/constants';
import * as $ from "axios";

class UserStore {
    constructor() {
        this.bindActions(UserActions);
        this.user = {
            'userId': null,
            'token': null
        };
        this.isRegistered = false;

    }

    resetStore() {
      const user = {
        userId: null,
        token: null
      }
      this.setState({user})
    }

    resetIsRegistered = () => {
        this.setState({isRegistered: false});
    };

    register(user) {
        let _this = this;
        this.resetIsRegistered();
        $.post(`${CONSTANTS.API_URL}/user/signup`, user)
            .then(res => {
                alert(res.data.msg);
                _this.setState({isRegistered: true});
            }).catch(err => {
                alert(err.response.data.message);
        })

    }

    login(user) {
        let _this = this;
        $.post(`${CONSTANTS.API_URL}/user/signin`, user)
            .then(res => {
                let user = {
                    userId: res.data.id,
                    token: res.data.token
                };
                localStorage.setItem('userToken', user.token);
                localStorage.setItem('userId', user.userId);
                _this.setState({user: user});
            }).catch(err => {
            alert(err.response.data.message);
        })

    }

    logout() {
      this.resetStore();
      localStorage.removeItem('userId');
      localStorage.removeItem('userToken');
    }

}
export default alt.createStore(UserStore , "UserStore");
