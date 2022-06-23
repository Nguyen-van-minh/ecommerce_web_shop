import request from "request";
const Product = require('../modal/Product')

require('dotenv').config();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = "https://bizweb.dktcdn.net/100/438/408/articles/he-thong-cua-hang16-z2626228850334-98bfbc6f8e881a9ce60213cb72f4e6af-yody-vn.jpg?v=1634625411703";
const IMAGE_GET_CATEGORY = "https://cdn.hpdecor.vn/wp-content/uploads/2022/05/yody-9.jpg";
const IMAGE_CONTRACT = "https://cafebiz.cafebizcdn.vn/162123310254002176/2021/7/31/photo-4-16277004079791975265066.jpg";
const IMAGE_HOT_PRODUCT = "https://thegioigiaitri.com.vn/wp-content/uploads/2021/07/8-5.jpg"

let callSendAPI = async (sender_psid, response) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    await sendTypingOn(sender_psid);
    await sendMarkReadMessenge(sender_psid);
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let sendTypingOn = (sender_psid) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingOn message sent!')
        } else {
            console.error("Unable to send sendTypingOn message:" + err);
        }
    });
}

let sendMarkReadMessenge = (sender_psid) => {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "mark_seen"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingOn message sent!')
        } else {
            console.error("Unable to send sendTypingOn message:" + err);
        }
    });
}

let getUsername = (sender_psid) => {
    return new Promise((resolve, reject) => {
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                body = JSON.parse(body);
                let username = `${body.first_name} ${body.last_name}`;
                resolve(username);
            } else {
                console.error("Unable to send message:" + err);
                reject(err)
            }
        });
    })

}



let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUsername(sender_psid);
            let response1 = { "text": `Chào mừng ${username} đến với Beautiful!` };

            let response2 = getStatedTemplate();

            await callSendAPI(sender_psid, response1);
            await callSendAPI(sender_psid, response2);
            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getStatedTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Chào mừng bạn đến với Beautiful",
                    "subtitle": "Dưới đây là các lựa chọn của shop",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Sản phẩm?",
                            "payload": "SHOW_CATEGORY",
                        },
                        {
                            "type": "postback",
                            "title": "Về shop?",
                            "payload": "ABOUT",
                        }
                    ],
                }]
            }
        }
    }

    return response;
}

let handleSendCategory = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getCategory(sender_psid);
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getCategory = (senderID) => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Danh mục sản phẩm của cửa hàng",
                        "subtitle": "Chúng tôi hân hạnh mang cho bạn những sản phẩm tốt nhất!",
                        "image_url": IMAGE_GET_CATEGORY,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Áo sơ mi",
                                "payload": "SOMI",
                            },
                            {
                                "type": "postback",
                                "title": "Áo polo",
                                "payload": "POLO",
                            },
                            {
                                "type": "postback",
                                "title": "Áo thun",
                                "payload": "THUN",
                            }
                        ],
                    },
                    {
                        "title": "Beautiful shop",
                        "subtitle": "Chúng tôi có thể cung cấp đơn hàng số lượng lớn!",
                        "image_url": IMAGE_CONTRACT,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_FORM}/${senderID}`,
                                "title": "Để lại thông tin liên hệ",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            }
                        ],
                    },
                    {
                        "title": "Sản phẩm của chúng tôi",
                        "subtitle": "Chúng tôi luôn cho ra mắt những sản phẩm chất lượng cao",
                        "image_url": IMAGE_HOT_PRODUCT,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Sản phẩm hot!",
                                "payload": "HOT_PRODUCTS",
                            }
                        ],
                    }
                ]
            }
        }
    }
    return response;
}

let handleSendAbout = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {

            let username = await getUsername(sender_psid);
            let response1 = { "text": `Chào mừng ${username} đến với shop, sau đây là video giới thiệu shop` }

            let response2 = getAbout();

            await callSendAPI(sender_psid, response1);
            await callSendAPI(sender_psid, response2);
            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getAbout = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "media",
                "elements": [
                    {
                        "media_type": "video",
                        "url": "https://business.facebook.com/102820205804919/videos/2849380588697839/",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Sản phẩm?",
                                "payload": "SHOW_CATEGORY",
                            },
                            {
                                "type": "web_url",
                                "url": "https://www.youtube.com/watch?v=SpS_jcYvWEA",
                                "title": "Xem trên youtube",
                            }
                        ]
                    }
                ]
            }
        }
    }
    return response;
}

let handleBackToMainCategory = async (sender_psid) => {
    await handleSendCategory(sender_psid)
}

let handleSendShowSomi = async (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getSomiTemplate();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getSomiTemplate = async () => {
    let products = await Product.find({ categoryID: '6264db5621128d8427f389f5' });
    let elements = [];
    if (products && products.length > 0) {
        products.slice(0, 5).map(item => {
            elements.push({
                "title": item.name,
                "subtitle": item.name,
                "image_url": item.image,
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://a36480nguyenvanminh.vercel.app/",
                        "title": "Đến trang sản phẩm"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh mục",
        "subtitle": "Danh mục các sản phẩm",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh mục",
                "payload": "BACK_TO_MAIN_CATEGORY",
            }
        ],
    })
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

    response.attachment.payload.elements = elements;
    console.log('check: ', response.attachment.payload.elements)

    return response;
}

let handleSendShowPolo = async (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getPoloTemplate();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getPoloTemplate = async () => {
    let products = await Product.find({ categoryID: '627672f47da7bf85bef9340e' });
    let elements = [];
    if (products && products.length > 0) {
        products.slice(0, 5).map(item => {
            elements.push({
                "title": item.name,
                "subtitle": item.name,
                "image_url": item.image,
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://a36480nguyenvanminh.vercel.app/",
                        "title": "Đến trang sản phẩm"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh mục",
        "subtitle": "Danh mục các sản phẩm",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh mục",
                "payload": "BACK_TO_MAIN_CATEGORY",
            }
        ],
    })
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

    response.attachment.payload.elements = elements;
    console.log('check: ', response.attachment.payload.elements)

    return response;
}


let handleSendShowThun = async (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getThunTemplate();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getThunTemplate = async () => {
    let products = await Product.find({ categoryID: '62640134dab2dff9845e830e' });
    let elements = [];
    if (products && products.length > 0) {
        products.slice(0, 5).map(item => {
            elements.push({
                "title": item.name,
                "subtitle": item.name,
                "image_url": item.image,
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://a36480nguyenvanminh.vercel.app/",
                        "title": "Đến trang sản phẩm"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh mục",
        "subtitle": "Danh mục các sản phẩm",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh mục",
                "payload": "BACK_TO_MAIN_CATEGORY",
            }
        ],
    })
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

    response.attachment.payload.elements = elements;
    console.log('check: ', response.attachment.payload.elements)

    return response;
}


let hotProducts = async (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getHotProducts();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getHotProducts = async () => {
    let products = await Product.find({}).sort({ sold: -1 }).limit(5)
    let elements = [];
    if (products && products.length > 0) {
        products.slice(0, 5).map(item => {
            elements.push({
                "title": item.name,
                "subtitle": item.name,
                "image_url": item.image,
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://a36480nguyenvanminh.vercel.app/",
                        "title": "Đến trang sản phẩm"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh mục",
        "subtitle": "Danh mục các sản phẩm",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh mục",
                "payload": "BACK_TO_MAIN_CATEGORY",
            }
        ],
    })
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

    response.attachment.payload.elements = elements;
    console.log('check: ', response.attachment.payload.elements)

    return response;
}

let handleSendShowThatLung = async (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getThatLungTemplate();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getThatLungTemplate = async () => {
    let products = await Product.find({ name: /Thắt lưng/i });
    let elements = [];
    if (products && products.length > 0) {
        products.slice(0, 5).map(item => {
            elements.push({
                "title": item.name,
                "subtitle": item.name,
                "image_url": item.image,
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://a36480nguyenvanminh.vercel.app/",
                        "title": "Đến trang sản phẩm"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh mục",
        "subtitle": "Danh mục các sản phẩm",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh mục",
                "payload": "BACK_TO_MAIN_CATEGORY",
            }
        ],
    })
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

    response.attachment.payload.elements = elements;
    console.log('check: ', response.attachment.payload.elements)

    return response;
}

let handleSendShowVi = async (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getViTemplate();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getViTemplate = async () => {
    let products = await Product.find({ name: /Ví/i });
    let elements = [];
    if (products && products.length > 0) {
        products.slice(0, 5).map(item => {
            elements.push({
                "title": item.name,
                "subtitle": item.name,
                "image_url": item.image,
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://a36480nguyenvanminh.vercel.app/",
                        "title": "Đến trang sản phẩm"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh mục",
        "subtitle": "Danh mục các sản phẩm",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh mục",
                "payload": "BACK_TO_MAIN_CATEGORY",
            }
        ],
    })
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

    response.attachment.payload.elements = elements;
    console.log('check: ', response.attachment.payload.elements)

    return response;
}

let handleSendShowVest = async (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = await getVestTemplate();
            await callSendAPI(sender_psid, response1);

            resolve('done');
        } catch (error) {
            reject(error)
        }
    })
}

let getVestTemplate = async () => {
    let products = await Product.find({ name: /Vest/i });
    let elements = [];
    if (products && products.length > 0) {
        products.slice(0, 5).map(item => {
            elements.push({
                "title": item.name,
                "subtitle": item.name,
                "image_url": item.image,
                "buttons": [
                    {
                        "type": "web_url",
                        "url": "https://a36480nguyenvanminh.vercel.app/",
                        "title": "Đến trang sản phẩm"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh mục",
        "subtitle": "Danh mục các sản phẩm",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh mục",
                "payload": "BACK_TO_MAIN_CATEGORY",
            }
        ],
    })
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": []
            }
        }
    }

    response.attachment.payload.elements = elements;
    console.log('check: ', response.attachment.payload.elements)

    return response;
}



module.exports = {
    handleGetStarted: handleGetStarted,
    handleSendCategory: handleSendCategory,
    handleSendShowSomi: handleSendShowSomi,
    handleSendAbout: handleSendAbout,
    handleBackToMainCategory: handleBackToMainCategory,
    handleSendShowPolo: handleSendShowPolo,
    handleSendShowThun: handleSendShowThun,
    hotProducts: hotProducts,
    callSendAPI: callSendAPI,
    getUsername: getUsername,
    handleSendShowThatLung: handleSendShowThatLung,
    handleSendShowVi: handleSendShowVi,
    handleSendShowVest: handleSendShowVest,
}