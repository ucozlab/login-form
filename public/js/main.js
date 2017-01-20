var loginApp = {};

loginApp.httpRequest = function (url) {

    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.withCredentials = true;
    // http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
        else {
            console.log(http.responseText);
        }
    };
    http.send();

};

loginApp.getFormData = function (form) {
    var formData = new FormData(form);
    return '?username='+formData.get('login-name')+'&password='+formData.get('login-password')+'';
};

loginApp.login = function (event, form) {
    event.preventDefault();
    this.httpRequest('https://www.prestigenews.com/api/v3/login'+ this.getFormData(form));
};
