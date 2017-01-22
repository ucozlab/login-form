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

    var formData = new FormData(form);

    if((formData.get('login-name') === this.name) && (formData.get('login-password') == this.password)) {

        this.success();

    } else if(this.checkLocalStorage()) {

        var match = JSON.parse(localStorage.getItem('loginFormMember')).some(function(member){
            return (member['login'] == formData.get('login-name') && member['password'] == formData.get('login-password'))
        });

        match ? this.success() : this.shake();

    } else {

        this.shake();

    }

};

loginApp.shake = function () {
    var form = document.getElementsByClassName('login-content__form')[0];
    form.classList.add('animated','shake');
    setTimeout(function () {
        form.classList.remove('animated','shake');
    }, 1000);
};

loginApp.success = function () {
    var page = document.getElementsByClassName('page')[0];
    page.classList.add('page--success');
    setTimeout(function () {
        document.getElementsByClassName('login')[0].style.display = 'none';
        page.classList.add('page--informer');
    }, 600);
};

loginApp.back = function () {
    var page = document.getElementsByClassName('page')[0];
    page.classList.remove('page--informer');
    setTimeout(function () {
        document.getElementsByClassName('login')[0].style.display = 'block';
        page.classList.remove('page--success');
    }, 600);
};

loginApp.flipCard = function (event) {
    event.preventDefault();
    var card = document.getElementsByClassName('card')[0];
    card.classList.toggle('flipped');
};

loginApp.newMember = function (event, form) {
    event.preventDefault();

    var formData  = new FormData(form),
        newMember = {
            login: formData.get('login-name'),
            password: formData.get('login-password')
        },
        validForm = Object.keys(newMember).every(function(val, index){
            return newMember[val]
        });

    if(this.checkLocalStorage() && validForm) {
        var storage = localStorage.getItem('loginFormMember'),
            members = storage && JSON.parse(storage),
            that    = this;

        members && members.push(newMember);

        storage
            ? localStorage.setItem('loginFormMember',JSON.stringify(members))
            : localStorage.setItem('loginFormMember',JSON.stringify([newMember]));

        this.newMemberSuccess();

        setTimeout(function() {
            that.flipCard(event);
            setTimeout(function() {
                that.newMemberSuccess();
            }, 1000);
        }, 600)

    } else {
        alert('Sorry, yor browser doesn\'t support localstorage :( Please try another(e.g. Chrome)');
    }
};

loginApp.newMemberSuccess = function () {
    var newmember = document.getElementsByClassName('newmember')[0];
    newmember.classList.toggle('newmember-added');
};

loginApp.checkLocalStorage = function () {
    return ('localStorage' in window && window['localStorage'] !== null);
}