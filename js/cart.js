/*eslint-disable*/
let itemNum = document.getElementById('item-num');
let list = JSON.parse(localStorage.getItem('cart'));
let productBox = document.getElementById('product-box');
let shipping = document.getElementById('shipping');
let payment = document.getElementById('payment');
let totalPrice = document.getElementById('total-price');
let shippingPrice = document.getElementById('shipping-price');
let payPrice = document.getElementById('pay-price');
let productPrice = 0;
let sumPrice = 0;
let checkoutBtn = document.getElementById('checkout');
let recipient;
let recipientReady = false;

/*eslint-enable*/

/*============================================================================================================
//show products in shopping cart and remove/change-qty feature
===============================================================================================================*/

function showCart() {
    // check if shopping list exist or not, then render shopping cart
    if (list == undefined || list.length === 0) {
        productBox.innerHTML = '<h2>購物車是空的</h2>';
        totalPrice.textContent = 0;
        shippingPrice.textContent = 0;
        payPrice.textContent = 0;
        itemNum.innerText = 0;
        checkoutBtn.classList.add('cart-disable');
        console.log('list empty');
    } else {
        // clear productBox
        productBox.innerHTML = '';
        let sumArr = [];
        // render shopping cart products
        for (let i = 0; i < list.length; i++) {
            // console.log(`${i}`);
            let item = document.createElement('div');
            let variant = document.createElement('div');
            let qty = document.createElement('div');
            let price = document.createElement('div');
            let subtotal = document.createElement('div');
            let remove = document.createElement('div');

            // main-image
            let mainImage = document.createElement('div');
            let innerImage = document.createElement('img');
            mainImage.setAttribute('class', 'main-image');
            innerImage.setAttribute('src', `${list[i].main_image}`);
            mainImage.appendChild(innerImage);

            // product-info
            let productInfo = document.createElement('div');
            productInfo.setAttribute('class', 'product-info');
            productInfo.innerHTML = `${list[i].name}<br>${list[i].id}<br><br>顏色：${list[i].color.name}<br>尺寸：${list[i].size}`;

            variant.appendChild(mainImage);
            variant.appendChild(productInfo);
            variant.setAttribute('class', 'variant');

            // qty
            let subtitle01 = document.createElement('div');
            subtitle01.setAttribute('class', 'subtitle');
            subtitle01.innerText = '數量';
            let select = document.createElement('select');
            select.setAttribute('name', 'qty');
            select.setAttribute('id', `${i}`);
            select.setAttribute('class', 'selectqty');
            for (let j = 1; j <= list[i].stock; j++) {
                let op = document.createElement('option');
                op.setAttribute('value', `${j}`);
                op.textContent = `${j}`;
                select.appendChild(op);
            }
            select.selectedIndex = `${list[i].qty - 1}`;
            qty.appendChild(subtitle01);
            qty.appendChild(select);
            qty.setAttribute('class', 'qty');

            // price
            let subtitle02 = document.createElement('div');
            subtitle02.setAttribute('class', 'subtitle');
            subtitle02.innerText = '單價';
            let price01 = document.createElement('div');
            price01.setAttribute('class', 'product-price');
            price01.textContent = `NT. ${list[i].price}`;
            price.appendChild(subtitle02);
            price.appendChild(price01);
            price.setAttribute('class', 'price');

            // subtotal
            let subtitle03 = document.createElement('div');
            subtitle03.setAttribute('class', 'subtitle');
            subtitle03.innerText = '小計';
            let price02 = document.createElement('div');
            price02.setAttribute('class', 'product-subtotal');
            let subtotalNum = list[i].price * list[i].qty;
            price02.textContent = `NT. ${subtotalNum}`;
            subtotal.appendChild(subtitle03);
            subtotal.appendChild(price02);
            subtotal.setAttribute('class', 'subtotal');
            sumArr.push(subtotalNum);

            // remove
            let removeImg = document.createElement('img');
            removeImg.setAttribute('src', './images/cart-remove.png');
            let imageBox = document.createElement('div');
            imageBox.setAttribute('onclick', `removeCart(${i})`);
            imageBox.setAttribute('class', 'remove-btn');
            imageBox.appendChild(removeImg);
            remove.appendChild(imageBox);
            remove.setAttribute('class', 'remove');

            item.setAttribute('class', 'product-item');
            item.appendChild(variant);
            item.appendChild(qty);
            item.appendChild(price);
            item.appendChild(subtotal);
            item.appendChild(remove);
            productBox.appendChild(item);
        }

        // get total price
        sumArr.forEach(function (sum) {
            productPrice += sum;
        });

        totalPrice.textContent = productPrice;
        sumPrice = productPrice + 60;
        payPrice.textContent = sumPrice;
        itemNum.innerText = list.length;
        addOnchange();
    }
}

/*eslint-disable*/
// remove product item
function removeCart(x) {
    list.splice(x, 1);
    console.log(list);
    localStorage.setItem('cart', JSON.stringify(list));
    alert('已移除商品');
    showCart();
}
/*eslint-ensable*/

//add change event to each pruduct-qty-selecter
function addOnchange() {
    let selecters = document.getElementsByClassName('selectqty');
    for (let k = 0; k < list.length; k++) {
        itemIndex = k;
        selecters[k].addEventListener('change', changeQty);
    }
}

// change qty event
function changeQty() {
    let index = this.id;
    let num = Number(this.value);
    list[index].qty = num;
    localStorage.setItem('cart', JSON.stringify(list));
    showCart();
}

/*============================================================================================================
//checkout info
===============================================================================================================*/

// get user's info
function getRecipient() {
    let name = document.getElementById('recipient-name');
    let email = document.getElementById('recipient-email');
    let phone = document.getElementById('recipient-phone');
    let address = document.getElementById('recipient-address');
    let times = document.getElementsByName('recipient-time');
    recipient = {
        name: '',
        phone: '',
        email: '',
        address: '',
        time: '',
    };

    let time;
    for (let i = 0; i < times.length; i++) {
        if (times[i].checked) {
            time = times[i].value;
            break;
        }
    }
    recipient.name = name.value;
    recipient.email = email.value;
    recipient.phone = phone.value;
    recipient.address = address.value;
    recipient.time = time;

    // check if blank is empty
    if (recipient.name.length === 0) {
        name.focus();
        alert('請輸入有效姓名');
        return;
    } else if (/[@]/.test(recipient.email) == false) {
        email.focus();
        email.setAttribute('placeholder', '請輸入有效email');
        return;
    } else if (/^09\d{8}$/.test(recipient.phone) == false) {
        phone.focus();
        phone.setAttribute('placeholder', '請輸入有效號碼');
        return;
    } else if (recipient.address.length === 0) {
        address.focus();
        alert('請輸入有效收件地址');
        return;
    }

    // if recipient data is ready, turn recipientReady to true
    recipientReady = true;
}

/*============================================================================================================
//Checkout API
===============================================================================================================*/

//get data from API
function checkoutApi(cartObj, callback) {
    let cartLoading = document.getElementById('loading-img');
    cartLoading.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    let data = JSON.stringify(cartObj);
    xhr.open('POST', `https://api.appworks-school.tw/api/1.0/order/checkout`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (accessToken) {
        xhr.setRequestHeader('Authorization', 'Bearer' + accessToken);
    }
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let xhrObj = JSON.parse(xhr.responseText);
            callback(xhrObj.data.number);
        } else if (xhr.status === 400) {
            alert('error 400' + xhr.responseText);
        } else if (xhr.status === 500) {
            alert('error 500' + xhr.responseText);
        }
    };
}

function checkout(e) {
    if (list !== null && list.length !== 0) {
        getRecipient();
        if (recipientReady) {
            onSubmit(e);
        }
    }
}

showCart();

// checkout event
checkoutBtn.addEventListener('click', checkout);
