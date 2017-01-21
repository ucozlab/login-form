var loginApp = {
    name: 'test',
    password: 123
};

loginApp.httpRequest = function (url) {

    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.onreadystatechange = function() {
        http.readyState == 4 && http.status == 200 && alert(http.responseText);
    };
    http.send();

};

loginApp.getFormData = function (form) {
    var formData = new FormData(form);
    return '?username='+formData.get('login-name')+'&password='+formData.get('login-password')+'';
};

loginApp.login = function (event, form) {
    event.preventDefault();
    // this.httpRequest('https://www.prestigenews.com/api/v3/login'+ this.getFormData(form));

    var formData = new FormData(form),
        page     = document.getElementsByClassName('page')[0];

    if((formData.get('login-name') === this.name) && (formData.get('login-password') == this.password)) {
        page.classList.add('page--success');
        setTimeout(function () {
            document.getElementsByClassName('login')[0].style.display = 'none';
            page.classList.add('page--informer');
        }, 600);
    }

};
