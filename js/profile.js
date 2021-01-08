let logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', function () {
    console.log('trigger logout event');
    FB.logout(function () {
        // console.log(response);
        console.log('logout');
        // alert('已經登出囉！');
        window.location = 'index.html';
    });
});
