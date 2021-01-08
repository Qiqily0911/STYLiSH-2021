/*============================================================================================================
// general variables
===============================================================================================================*/

let num; //set num=next_paging.value
let scrollTrigger = true; //set scroll trigger=true
let params = new URLSearchParams(window.location.search);
let tagName = params.get('tag');
let keyword = params.get('tag');
let tagWomen = document.getElementById('tagWomen');
let tagMen = document.getElementById('tagMen');
let tagAccessories = document.getElementById('tagAccessories');
let imageBox = document.getElementById('hero-img-box');
let pagingLoading = document.getElementById('pagingLoading');

/*============================================================================================================
//Marketing Campaigns API
===============================================================================================================*/

//get data for API
function marketingApi(callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let xhrObj = JSON.parse(xhr.responseText);
            callback(xhrObj);
        }
    };
    xhr.open(
        'GET',
        'https://api.appworks-school.tw/api/1.0/marketing/campaigns'
    );
    xhr.send();
}

//render key visual data
function keyVisual(api) {
    for (let i = 0; i < api.data.length; i++) {
        // create container
        let container = document.createElement('div');
        let link = document.createElement('a');
        let storyBox = document.createElement('div');

        container.setAttribute('id', `${api.data[i].id}`);
        link.setAttribute('href', `product.html?id=${api.data[i].product_id}`);
        link.style.backgroundImage = `url(${api.data[i].picture})`;
        //get data from api then give each tag the corresponding content
        storyBox.innerText = api.data[i].story;

        // add corresponding class to each container & tag
        storyBox.className = 'story';
        container.className = 'key-visual';

        link.appendChild(storyBox);
        container.appendChild(link);
        imageBox.appendChild(container);
    }

    let picSwitch = document.getElementById('pic-switch');
    for (let i = 0; i < api.data.length; i++) {
        let dot = document.createElement('div');
        dot.setAttribute('onclick', `currentSlide(${api.data[i].id})`);
        dot.className = 'dot';
        picSwitch.appendChild(dot);
    }
    // render default
    document.getElementsByClassName('key-visual')[0].className += ' current';
    document.getElementsByClassName('dot')[0].className += ' dot-active';
}

marketingApi(keyVisual);

// slideshow
let slides = document.getElementsByClassName('key-visual');
let dots = document.getElementsByClassName('dot');
let slideIndex = 1;

function switchSlide(x) {
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('current');
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('dot-active');
    }

    slides[x].className += ' current';
    dots[x].className += ' dot-active';
    // console.log(x);

    if (slideIndex >= slides.length - 1) {
        slideIndex = 0;
    } else {
        slideIndex += 1;
    }
}

// select slide
/*eslint-disable*/
function currentSlide(n) {
    selectSlides((picIndex = n));
}
/*eslint-ensable*/

function selectSlides(picIndex) {
    for (let i = 0; i < slides.length; i++) {
        slides[i].className = slides[i].className.replace(' current', '');
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' dot-active', '');
    }
    slides[picIndex - 1].className += ' current';
    dots[picIndex - 1].className += ' dot-active';
    slideIndex = picIndex - 1;
}

// mouse over pause event
let isPaused = false;
let timer = setInterval(function () {
    if (!isPaused) {
        switchSlide(slideIndex);
    }
}, 5000);

imageBox.addEventListener('mouseenter', function () {
    isPaused = true;
    //    console.log("mouse in");
});
imageBox.addEventListener('mouseleave', function () {
    isPaused = false;
    //    console.log("mouse out");
});

/*============================================================================================================
// Connect to Product List API by AJAX for data of all products
===============================================================================================================*/

function getList(category, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let xhrObj = JSON.parse(xhr.responseText);
            callback(xhrObj);
        }
    };
    xhr.open(
        'GET',
        `https://api.appworks-school.tw/api/1.0/products/${category}`
    );
    xhr.send();
}

/*============================================================================================================
//default page
===============================================================================================================*/

function hasParam() {
    //use the get suffix to load corresponding data
    if (tagName) {
        switch (tagName) {
            case 'women':
            case 'men':
            case 'accessories':
                getList(`${tagName}?paging=0`, render);
                break;
            default:
                getList(`search?keyword=${keyword}`, render);
        }
    } else {
        getList('all?paging=0', render);
        //   console.log("render getList, paging=0");
        tagName = 'all';
        num = 0;
    }

    //Infinite Scroll Feature
    window.addEventListener('scroll', () => {
        let selectFooter = document.querySelector('footer');
        let footerTop = selectFooter.getBoundingClientRect().top;
        //when user scroll to the bottom of the page
        if (scrollTrigger) {
            if (footerTop - window.innerHeight <= 0 && num >= 1) {
                pagingLoading.classList.remove('d-none');
                getPagingList(tagName, num, function (res) {
                    render(res);
                });
            }
        }
    });
}

hasParam();

/*============================================================================================================
// change category btn color of clicked-category (by tag-name)
===============================================================================================================*/

switch (tagName) {
    case 'women':
        tagWomen.classList.add('clicked');
        break;
    case 'men':
        tagMen.classList.add('clicked');
        break;
    case 'accessories':
        tagAccessories.classList.add('clicked');
        break;
}

/*============================================================================================================
//paging feature:connect to API by AJAX 
===============================================================================================================*/

function getPagingList(category, num, callback) {
    scrollTrigger = false;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let xhrObj = JSON.parse(xhr.responseText);
            callback(xhrObj);
        }
    };

    xhr.open(
        'GET',
        `https://api.appworks-school.tw/api/1.0/products/${category}?paging=${num}`
    );
    xhr.send();
}

/*============================================================================================================
//render api data
===============================================================================================================*/

function render(api) {
    let products = document.getElementById('products');
    num = api.next_paging;

    if (api.data.length === 0) {
        let notFound = document.createElement('div');
        notFound.className = 'not-found';
        notFound.innerText = `糟糕！找不到 “${tagName}” 商品，請重新輸入！`;
        products.appendChild(notFound);
    } else {
        for (let i = 0; i < api.data.length; i++) {
            // create containers: product-box,image-box and color-box
            let productBox = document.createElement('div');
            let mainImage = document.createElement('a');
            let colorBox = document.createElement('div');

            //create tags: image, title and price tag
            let imageTag = document.createElement('img');
            let titleTag = document.createElement('div');
            let priceTag = document.createElement('div');

            //get data from api then give each tag the corresponding content
            mainImage.setAttribute('href', `product.html?id=${api.data[i].id}`);
            imageTag.setAttribute('src', api.data[i].main_image);
            imageTag.setAttribute('alt', api.data[i].title);
            titleTag.appendChild(document.createTextNode(api.data[i].title));
            priceTag.appendChild(
                document.createTextNode(`TWD. ${api.data[i].price}`)
            );

            //create div and set background-color, then put them into colorBox
            let getColors = api.data[i].colors;
            for (let j = 0; j < getColors.length; j++) {
                let colorDiv = document.createElement('div');
                colorDiv.style.backgroundColor = `#${getColors[j].code}`;
                colorBox.appendChild(colorDiv);
            }

            // add corresponding class to each container & tag
            productBox.className = 'box';
            mainImage.className = 'main-image';
            colorBox.className = 'color-box';
            titleTag.className = 'title';
            priceTag.className = 'price';

            mainImage.appendChild(imageTag);

            // add all tags into productBox
            productBox.appendChild(mainImage);
            productBox.appendChild(colorBox);
            productBox.appendChild(titleTag);
            productBox.appendChild(priceTag);

            // add product boxes into <div id='products'></div>
            products.appendChild(productBox);
        }
        scrollTrigger = true;
        //  console.log('render complete open=' + scrollTrigger);
        pagingLoading.classList.add('d-none');
    }
}

/*============================================================================================================
//shopping cart
===============================================================================================================*/
let itemNum = document.getElementById('item-num');
let list = [];

if (localStorage.getItem('cart')) {
    list = JSON.parse(localStorage.getItem('cart'));
    itemNum.innerText = list.length;
}
