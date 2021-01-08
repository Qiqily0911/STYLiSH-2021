/* eslint-disable no-undef */
let productParams = new URLSearchParams(window.location.search);
let orderNum = productParams.get('number');
let searchBar = document.getElementById('search-bar');
let searchIcon = document.getElementById('search-icon-mobile');
let searchBox = document.getElementById('search');
let profileBtn = document.getElementById('profile');
let ordernumBox = document.getElementById('order-num');
let userName = document.getElementById('userName');
let userEmail = document.getElementById('userEmail');
let userPic = document.getElementById('userPic');
let userId = document.getElementById('userId');
let accessToken;

/*============================================================================================================
//Sign in API
===============================================================================================================*/

//002. send fb access token to user-sign-in api and get uer-obj
function signInApi(obj) {
    let xhr = new XMLHttpRequest();
    let data = JSON.stringify(obj);
    xhr.open('POST', `https://api.appworks-school.tw/api/1.0/user/signin`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let userOjb = JSON.parse(xhr.responseText);
            /*eslint-disable */
            accessToken = userOjb.data.access_token;
            if (userPic) {
                renderProfile(userOjb);
            }
            // else if (location.pathname === '/students/chia-chi/cart.html') {
            //     // console.log(userOjb.data.access_token);
            //     accessToken = userOjb.data.access_token;
            // }

            /*eslint-enable */
        } else if (xhr.status === 403) {
            alert('error 403=' + xhr.responseText);
        } else if (xhr.status === 400) {
            alert('error 400=' + xhr.responseText);
        } else if (xhr.status === 500) {
            alert('error 500=' + xhr.responseText);
        }
    };
}

/*============================================================================================================
//FB
===============================================================================================================*/

// 001. Facebook JavaScript SDK
window.fbAsyncInit = function () {
    FB.init({
        appId: '709176960011255',
        cookie: true,
        xfbml: true,
        version: 'v8.0',
    });
    console.log('init');

    let signInObj = {
        provider: 'facebook',
        email: ' ',
        password: ' ',
        access_token: ' ',
    };

    // 在剛在載入網頁時檢查FB帳號是否登入
    FB.getLoginStatus(
        function (response) {
            // The current login status of the person.
            if (response.status === 'connected') {
                console.log('connected');
                let token = response.authResponse.accessToken;
                signInObj.access_token = token;
                // sign in api
                signInApi(signInObj);
            } else {
                if (userName) {
                    alert('還沒登入會員呦！');
                    window.location = 'index.html';
                }
            }
        },
        {
            scope: 'email',
            auth_type: 'rerequest',
        }
    );
};

(function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

function checkLoginState() {
    // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response); // The current login status of the person.
    if (response.status === 'connected') {
        console.log('connected');
        // turn to profile page
        window.location = 'profile.html';
    } else {
        // Not logged into your webpage or we are unable to tell.
        alert('請登入FB會員帳號！');
        FB.login();
    }
}

//003. render profile page
function renderProfile(api) {
    let cartLoading = document.getElementById('loading-img');
    // cartLoading.classList.add('d-block');
    userName.textContent = api.data.user.name;
    userEmail.textContent = api.data.user.email;
    userId.textContent = api.data.user.id;
    userPic.style.backgroundImage = `url(${api.data.user.picture})`;
    cartLoading.classList.add('d-none');
}

// add click event to profile btn
profileBtn.addEventListener('click', checkLoginState);

/*============================================================================================================
//Search feature
===============================================================================================================*/

// mobile version search feature
searchIcon.addEventListener('click', function () {
    searchBox.style.display = 'block';
    searchIcon.style.display = 'none';
    searchBar.focus();
});

if (window.innerWidth < 1000) {
    searchBar.addEventListener('blur', () => {
        // console.log('blur');
        searchBox.style.display = 'none';
        searchIcon.style.display = 'block';
    });
}

/*============================================================================================================
//thank you page
===============================================================================================================*/

if (orderNum) {
    ordernumBox.innerText = orderNum;
    alert('成功送出訂單！');
}
