/*eslint-disable*/
/*============================================================================================================
//General variables
===============================================================================================================*/
let productId = productParams.get('id');
let variants;
let minus = document.getElementsByClassName('op-btn')[0];
let add = document.getElementsByClassName('op-btn')[1];
let amount = document.getElementById('amount-value');
let num;
let limit;

let colorBox = document.getElementsByClassName('color');
let sizeBox = document.getElementsByClassName('size');
let colorCode;
let colorIndex;
let sizeSelect;
let sizeIndex;
let colorStockList;

/*============================================================================================================
//Product-detail API
===============================================================================================================*/

//get data from API
function productData(productId, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let xhrObj = JSON.parse(xhr.responseText);
            callback(xhrObj);
        }
    };
    xhr.open(
        'GET',
        `https://api.appworks-school.tw/api/1.0/products/details?id=${productId}`
    );
    xhr.send();
}

//render product-detail data
function productRender(api) {
    // load product stock data
    variants = api.data.variants;

    // get element
    let productImage = document.getElementById('product-image');
    let productTitle = document.getElementById('product-title');
    let productId = document.getElementById('product-id');
    let productPrice = document.getElementById('product-price');
    let productColors = document.getElementById('product-colors');
    let productSizes = document.getElementById('product-sizes');
    let productDetail = document.getElementById('product-detail');
    let productStory = document.getElementById('product-story');

    // create element
    let mainImage = document.createElement('img');
    mainImage.setAttribute('id', 'main-image');
    mainImage.setAttribute('alt', `${api.data.title}`);
    mainImage.setAttribute('src', `${api.data.main_image}`);
    productImage.appendChild(mainImage);

    productTitle.textContent = `${api.data.title}`;
    productId.textContent = `${api.data.id}`;
    productPrice.textContent = `TWD.${api.data.price}`;

    for (let i = 0; i < api.data.colors.length; i++) {
        let color = document.createElement('div');
        color.value = api.data.colors[i];
        color.style.backgroundColor = `#${color.value.code}`;
        color.setAttribute('data-color', `${color.value.code}`);
        color.setAttribute('onclick', `currentColor(${i})`);
        color.className = 'color';
        productColors.appendChild(color);
    }

    for (let j = 0; j < api.data.sizes.length; j++) {
        let size = document.createElement('div');
        size.value = api.data.sizes[j];
        size.textContent = `${size.value}`;
        size.setAttribute('data-size', `${size.value}`);
        size.setAttribute('onclick', `currentSize(${j})`);
        size.className = 'size';
        productSizes.appendChild(size);
    }

    productDetail.innerText = `${api.data.note}\r\n\r\n${api.data.texture}\r\n${api.data.description}\r\n\r\n清洗：${api.data.wash}\r\n產地：${api.data.place}`;
    productStory.innerHTML = `<div class"text">${api.data.story}</div> <img src="${api.data.images[0]}"><img src="${api.data.images[1]}">`;

    // render default
    document.getElementsByClassName('color')[0].className += ' current';
    document.getElementsByClassName('size')[0].className += ' current';

    colorIndex = 0;
    sizeIndex = 0;
    // to tell whether color/size have stock or not
    stockAmount(colorIndex);

    colorStockList = variantsList();
    // let x = sizeBox[sizeIndex].dataset.size;
    // let ans = colorStockList[colorIndex][x];
    // console.log('stock= ' + ans);
}

//render default page
productData(productId, productRender);

/*============================================================================================================
//select color, size and amount
===============================================================================================================*/
// get stock amount
function stockAmount(index) {
    //clear sizeBox class into default
    for (let k = 0; k < sizeBox.length; k++) {
        sizeBox[k].className = sizeBox[k].className.replace('disable', '');
    }

    // get current stock
    for (let i = 0; i < variants.length; i++) {
        if (
            variants[i].color_code === colorBox[index].dataset.color &&
            variants[i].size === sizeBox[sizeIndex].dataset.size
        ) {
            limit = variants[i].stock;
        }
    }

    // if defualt stock=0; change current state
    if (limit === 0) {
        sizeBox[sizeIndex].className = sizeBox[sizeIndex].className.replace(
            'current',
            ''
        );
        sizeBox[sizeIndex].classList.add('disable');
        for (let i = 0; i < sizeBox.length; i++) {
            if (variants[i].stock !== 0) {
                sizeBox[i].classList.add('current');
                limit = variants[i].stock;
                break;
            }
        }
    }

    // if certain color has size/ stock=0, change the class
    for (let i = 0; i < variants.length; i++) {
        if (variants[i].color_code === colorBox[index].dataset.color) {
            if (variants[i].stock === 0) {
                for (let j = 0; j < sizeBox.length; j++) {
                    if (variants[i].size === sizeBox[j].innerText) {
                        sizeBox[j].classList.add('disable');
                    }
                }
            }
        }
    }

    num = 1;
    amount.innerText = num;
    // console.log('limit= ' + limit);
}

// select [color] & add class="current"
function currentColor(index) {
    for (let i = 0; i < colorBox.length; i++) {
        colorBox[i].className = colorBox[i].className.replace('current', '');
    }
    colorBox[index].classList.add('current');
    currentSize(0);
    colorIndex = index;
    colorCode = colorBox[index].dataset.color;
    stockAmount(index);
}

// select [size] & add class="current"
function currentSize(index) {
    for (let i = 0; i < sizeBox.length; i++) {
        sizeBox[i].className = sizeBox[i].className.replace('current', '');
    }

    // if (sizeBox[sizeIndex].classList.contains('disable') == false) {

    sizeIndex = index;
    // console.log('current size= ' + sizeIndex);
    sizeBox[index].classList.add('current');
    sizeSelect = sizeBox[index].dataset.size;
    // console.log('size index= ' + sizeIndex);
    // sizeIndex = index;
    stockAmount(colorIndex);
    // }

    let x = sizeBox[sizeIndex].dataset.size;
    let ans = colorStockList[colorIndex][x];
    console.log('stock= ' + ans);
}

minus.addEventListener('click', function () {
    num = Number(amount.innerText) + Number(minus.dataset.value);
    if (num <= 1) {
        num = 1;
    }
    amount.innerText = num;
});

add.addEventListener('click', function () {
    num = Number(amount.innerText) + Number(add.dataset.value);
    if (num >= limit) {
        num = limit;
        // console.log(num);
    } else if (limit === 0) {
        num = 1;
        // console.log('else if' + num);
    }
    amount.innerText = num;
});

// <-------get variants list (into array)--------->
function sizeStock(index) {
    let arr = [];
    for (let i = 0; i < variants.length; i++) {
        if (variants[i].color_code === colorBox[index].value.code) {
            arr.push(variants[i]);
        }
    }

    let toObj = (colorVariants) => {
        let colorSize = {};
        colorVariants.forEach((x) => {
            if (colorSize[x.size]) {
                colorSize[x.size] = x.stock;
            } else {
                colorSize[x.size] = x.stock;
            }
        });
        return colorSize;
    };

    return toObj(arr);
}

function variantsList() {
    let list = [];
    for (let i = 0; i < colorBox.length; i++) {
        list.push(sizeStock(i));
    }
    // console.log(list);
    return list;
}

/*============================================================================================================
//shopping cart
===============================================================================================================*/

let itemNum = document.getElementById('item-num');
let addCart = document.getElementById('add-cart');

addCart.addEventListener('click', function () {
    addList();
});

let list = [];
let cartList;
// console.log('開始的list');
// console.log(list);

if (localStorage.getItem('cart')) {
    list = JSON.parse(localStorage.getItem('cart'));
    itemNum.innerText = list.length;
    // console.log(list);
    // console.log('get');
}

function addList() {
    // console.log('------addlist-------');
    // console.log(list);
    let productColor = document.getElementsByClassName('current')[0].value;
    // console.log(productColor);
    let parseID = Number(productId);
    let productImage = document.getElementById('main-image').src;
    let productName = document.getElementById('product-title').innerText;
    let getPrice = document.getElementById('product-price').innerText;
    let productPrice = Number(getPrice.slice(4));
    let productQty = Number(document.getElementById('amount-value').innerText);
    let productSize = document.getElementsByClassName('current')[1].dataset
        .size;

    cartList = {
        color: productColor,
        id: parseID,
        main_image: productImage,
        name: productName,
        price: productPrice,
        qty: productQty,
        size: productSize,
        stock: limit,
    };

    // check if the cart has the same product
    let index;

    if (list.length === 0) {
        localStorage.setItem('cart', JSON.stringify(list));
        console.log('0');
    } else {
        for (let i = 0; i < list.length; i++) {
            if (
                cartList.id === list[i].id &&
                cartList.color.code === list[i].color.code &&
                cartList.size === list[i].size
            ) {
                index = i;
                console.log('same');
            }
        }
    }

    if (index == undefined) {
        listPush();
        console.log('add');
    } else {
        list[index] = cartList;
        localStorage.setItem('cart', JSON.stringify(list));
        alert(`已更改商品數量為 ${cartList.qty} 件！`);
    }

    // change the shopping number
    itemNum.innerText = list.length;
}

function listPush() {
    list.push(cartList);
    localStorage.setItem('cart', JSON.stringify(list));
    alert(`已將商品加入購物車！`);
}
