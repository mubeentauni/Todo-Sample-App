
class Helpers {

    constructor() {
        return this;
    }

    checkValidation(configuration, obj) {
        let temp = {};
        let isValid = true;

        configuration.forEach((item) => {
            temp[item.name] = [];

            Object.keys(item.validators).forEach((v) => {
                switch(v) {
                    case 'required':
                        if(item.validators[v]) {
                            if (!obj[item.name]) {
                                isValid = false;
                                temp[item.name].push(item.messages[v]);
                            }
                        }
                        break;

                    case 'email':
                        const patt = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                        const res = patt.test(obj[item.name]);
                        if (!res){
                            isValid = false;
                            temp[item.name].push(item.messages[v]);
                        }
                        break;

                    case 'match':
                        if (obj[item.name] !== obj[item.validators[v]]){
                            isValid = false;
                            temp[item.name].push(item.messages[v]);
                        }
                }
            });


        });
        return {
            isValid,
            data: temp
        }
    }

    getHeader() {
        let header = {
            'Content-Type': 'application/json'
        };
        header['authorization'] = localStorage.getItem('userToken');
        return {headers: header};

    }
}

export default new Helpers();