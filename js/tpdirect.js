TPDirect.card.setup({
    // Display ccv field
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****',
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY',
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv',
        },
    },

    styles: {
        // Style all elements
        input: {
            color: 'gray',
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            color: 'gray',
        },
        // style valid state
        '.valid': {
            color: '#313538',
        },
        // style invalid state
        '.invalid': {
            color: 'red',
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            input: {
                color: 'gary',
            },
        },
    },
});

TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true;
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled');
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true);
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay', 'unknown'];
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError();
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess();
    } else {
        // setNumberFormGroupToNormal();
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError();
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess();
    } else {
        // setNumberFormGroupToNormal();
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError();
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess();
    } else {
        // setNumberFormGroupToNormal();
    }
});

// call TPDirect.card.getPrime when user submit form to get tappay prime

/*eslint-disable*/
function onSubmit(event) {
    event.preventDefault();

    // Get TapPay Fields  status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // Check can getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('信用卡資訊填寫錯誤');
        return;
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('信用卡資訊填寫錯誤');
            return;
        }

        let cartList = {
            prime: result.card.prime,
            order: {
                shipping: shipping.value,
                payment: payment.value,
                subtotal: productPrice,
                freight: 60,
                total: sumPrice,
                recipient: recipient,
                list: list,
            },
        };

        checkoutApi(cartList, clearPage);

        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    });
}

// clear localstorage and direct to thankyou page
function clearPage(orderNum) {
    localStorage.clear();
    window.location = 'thankyou.html?number=' + orderNum;
}
