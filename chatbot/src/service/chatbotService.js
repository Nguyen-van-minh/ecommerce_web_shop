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
            let response1 = { "text": `Ch??o m???ng ${username} ?????n v???i Beautiful!` };

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
                    "title": "Ch??o m???ng b???n ?????n v???i Beautiful",
                    "subtitle": "D?????i ????y l?? c??c l???a ch???n c???a shop",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "S???n ph???m?",
                            "payload": "SHOW_CATEGORY",
                        },
                        {
                            "type": "postback",
                            "title": "V??? shop?",
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
                        "title": "Danh m???c s???n ph???m c???a c???a h??ng",
                        "subtitle": "Ch??ng t??i h??n h???nh mang cho b???n nh???ng s???n ph???m t???t nh???t!",
                        "image_url": IMAGE_GET_CATEGORY,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "??o s?? mi",
                                "payload": "SOMI",
                            },
                            {
                                "type": "postback",
                                "title": "??o polo",
                                "payload": "POLO",
                            },
                            {
                                "type": "postback",
                                "title": "??o thun",
                                "payload": "THUN",
                            }
                        ],
                    },
                    {
                        "title": "Beautiful shop",
                        "subtitle": "Ch??ng t??i c?? th??? cung c???p ????n h??ng s??? l?????ng l???n!",
                        "image_url": IMAGE_CONTRACT,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": `${process.env.URL_WEB_VIEW_FORM}/${senderID}`,
                                "title": "????? l???i th??ng tin li??n h???",
                                "webview_height_ratio": "tall",
                                "messenger_extensions": true
                            }
                        ],
                    },
                    {
                        "title": "S???n ph???m c???a ch??ng t??i",
                        "subtitle": "Ch??ng t??i lu??n cho ra m???t nh???ng s???n ph???m ch???t l?????ng cao",
                        "image_url": IMAGE_HOT_PRODUCT,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "S???n ph???m hot!",
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
            let response1 = { "text": `Ch??o m???ng ${username} ?????n v???i shop, sau ????y l?? video gi???i thi???u shop` }

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
                                "title": "S???n ph???m?",
                                "payload": "SHOW_CATEGORY",
                            },
                            {
                                "type": "web_url",
                                "url": "https://www.youtube.com/watch?v=SpS_jcYvWEA",
                                "title": "Xem tr??n youtube",
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
                        "title": "?????n trang s???n ph???m"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh m???c",
        "subtitle": "Danh m???c c??c s???n ph???m",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh m???c",
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
                        "title": "?????n trang s???n ph???m"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh m???c",
        "subtitle": "Danh m???c c??c s???n ph???m",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh m???c",
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
                        "title": "?????n trang s???n ph???m"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh m???c",
        "subtitle": "Danh m???c c??c s???n ph???m",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh m???c",
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
                        "title": "?????n trang s???n ph???m"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh m???c",
        "subtitle": "Danh m???c c??c s???n ph???m",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh m???c",
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
    let products = await Product.find({ name: /Th???t l??ng/i });
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
                        "title": "?????n trang s???n ph???m"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh m???c",
        "subtitle": "Danh m???c c??c s???n ph???m",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh m???c",
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
    let products = await Product.find({ name: /V??/i });
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
                        "title": "?????n trang s???n ph???m"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh m???c",
        "subtitle": "Danh m???c c??c s???n ph???m",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh m???c",
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
                        "title": "?????n trang s???n ph???m"
                    }
                ],
            })
        })
    }
    elements.push({
        "title": "Danh m???c",
        "subtitle": "Danh m???c c??c s???n ph???m",
        "image_url": IMAGE_GET_CATEGORY,
        "buttons": [
            {
                "type": "postback",
                "title": "Danh m???c",
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