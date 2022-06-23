require('dotenv').config();
import request from "request";
import chatbotService from "../service/chatbotService";
import moment from "moment";
const { GoogleSpreadsheet } = require('google-spreadsheet');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;

let getHomePage = async (req, res) => {
    return res.render('homePage.ejs');
};

let writeDataToGoogleSheet = async (data) => {
    let currentDate = new Date();
    const format = "HH:mm DD/MM/YYYY"
    let formatedDate = moment(currentDate).format(format);

    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
        client_email: JSON.parse(`"${CLIENT_EMAIL}"`),
        private_key: JSON.parse(`"${PRIVATE_KEY}"`),
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow(
        {
            "Tên Facebook": data.username,
            "Email": data.email,
            "Số điện thoại": `'${data.phoneNumber}`,
            "Thời gian": formatedDate,
            "Tên khách hàng": data.customerName
        });
}

let postWebhook = (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}

let getWebhook = (req, res) => {
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

// Handles messages events
async function handleMessage(sender_psid, received_message) {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        if (received_message.text.includes("sơ mi")) {
            response = {
                "text": `Cảm ơn bạn đã quan tâm, sau đây là một số sản phẩm áo sơ mi của shop ạ`
            }
            await chatbotService.handleSendShowSomi(sender_psid);
        }

        else if (received_message.text.includes("polo")) {
            response = {
                "text": `Cảm ơn bạn đã quan tâm, sau đây là một số sản phẩm áo Polo của shop ạ`
            }
            await chatbotService.handleSendShowPolo(sender_psid);
        }

        else if (received_message.text.includes("thắt lưng")) {
            response = {
                "text": `Cảm ơn bạn đã quan tâm, sau đây là một số sản phẩm thắt lưng của shop ạ`
            }
            await chatbotService.handleSendShowThatLung(sender_psid);
        }

        else if (received_message.text.includes("lỏng")) {
            response = {
                "text": `Cảm ơn bạn, sau đây là một số sản phẩm gợi ý của shop ạ`
            }
            await chatbotService.handleSendShowThatLung(sender_psid);
        }

        else if (received_message.text.includes("rộng")) {
            response = {
                "text": `Cảm ơn bạn, sau đây là một số sản phẩm thắt lưng của shop ạ`
            }
            await chatbotService.handleSendShowThatLung(sender_psid);
        }

        else if (received_message.text.includes("ví")) {
            response = {
                "text": `Cảm ơn bạn, sau đây là một số mẫu ví của shop ạ`
            }
            await chatbotService.handleSendShowVi(sender_psid);
        }

        else if (received_message.text.includes("tiền")) {
            response = {
                "text": `Cảm ơn bạn, sau đây là một số gợi ý của shop ạ`
            }
            await chatbotService.handleSendShowVi(sender_psid);
        }

        else if (received_message.text.includes("thun")) {
            response = {
                "text": `Cảm ơn bạn, sau đây là một số sản phẩm áo thun của shop ạ`
            }
            await chatbotService.handleSendShowThun(sender_psid);
        }

        else if (received_message.text.includes("vest")) {
            response = {
                "text": `Cảm ơn bạn, sau đây là một số sản phẩm áo Vest của shop ạ`
            }
            await chatbotService.handleSendShowVest(sender_psid);
        }

        else if (received_message.text.includes("cưới")) {
            response = {
                "text": `Cảm ơn bạn, sau đây là một số sản phẩm gợi ý của shop ạ`
            }
            await chatbotService.handleSendShowVest(sender_psid);
        }

        else if (received_message.text.includes("chú rể")) {
            response = {
                "text": `Cảm ơn bạn, sau đây là một số sản phẩm gợi ý của shop ạ`
            }
            await chatbotService.handleSendShowVest(sender_psid);
        }

        else if (received_message.text.includes("size")) {
            response = {
                "text": `Cảm ơn bạn đã quan tâm, sau đây là một số size với cân nặng và chiều cao, bạn tham khảo nhé: 

                                Chiều cao       Cân nặng          Size
                                --------------------------------------                           
                                Dưới 1m69       Dưới 65kg          M  
                                1m70 - 1m74     66-70kg            L   
                                1m74 - 1m76     70-73kg            XL                                                                
                                1m74 - 1m77     73-76kg            2XL            
                                Trên 1m77           76-80kg            3XL                                                                                                                                                
                                --------------------------------------                    
                                Người mẫu : 70kg - 1m70 size chuẩn XL
                                Hơn 98% khách hàng đã chọn đúng size theo bảng chọn này.
                `
            }
        }

        else if (received_message.text.includes("cao")) {
            response = {
                "text": `Cảm ơn bạn đã quan tâm, sau đây là một số size với cân nặng và chiều cao, bạn tham khảo nhé: 

                                Chiều cao       Cân nặng          Size
                                --------------------------------------                           
                                Dưới 1m69       Dưới 65kg          M  
                                1m70 - 1m74     66-70kg            L   
                                1m74 - 1m76     70-73kg            XL                                                                
                                1m74 - 1m77     73-76kg            2XL            
                                Trên 1m77           76-80kg            3XL                                                                                                                                                
                                --------------------------------------                    
                                Người mẫu : 70kg - 1m70 size chuẩn XL
                                Hơn 98% khách hàng đã chọn đúng size theo bảng chọn này.
                `
            }
        }

        else if (received_message.text.includes("nặng")) {
            response = {
                "text": `Cảm ơn bạn đã quan tâm, sau đây là một số size với cân nặng và chiều cao, bạn tham khảo nhé: 

                                Chiều cao       Cân nặng          Size
                                --------------------------------------                           
                                Dưới 1m69       Dưới 65kg          M  
                                1m70 - 1m74     66-70kg            L   
                                1m74 - 1m76     70-73kg            XL                                                                
                                1m74 - 1m77     73-76kg            2XL            
                                Trên 1m77           76-80kg            3XL                                                                                                                                                
                                --------------------------------------                    
                                Người mẫu : 70kg - 1m70 size chuẩn XL
                                Hơn 98% khách hàng đã chọn đúng size theo bảng chọn này.
                `
            }
        }

        else if (received_message.text.includes("thanh toán")) {
            response = {
                "text": `Hiện tại shop áp dụng các hình thức thanh toán khi nhận hàng (COD) và thanh toán online qua ví điện tử Paypal hoặc VNPay ạ`
            }
        }

        else if (received_message.text.includes("ship")) {
            response = {
                "text": `Shop sẽ thanh toán phí vận chuyển cho tất cả các sản phẩm và vận chuyển qua đợn vị giao hàng tiết kiệm ạ`
            }
        }

        else if (received_message.text.includes("vận chuyển")) {
            response = {
                "text": `Shop miễn phí vận chuyển cho tất cả các sản phẩm (Free ship), và vận chuyển qua đợn vị giao hàng tiết kiệm ạ`
            }
        }


        else {
            response = {
                "text": `Tin nhắn "${received_message.text}" của bạn đang được xử lý. Bạn vui lòng chờ nhân viên một chút nhé!`
            }
        }

    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}


async function handlePostback(sender_psid, received_postback) {
    let response;

    let payload = received_postback.payload;

    switch (payload) {
        case 'Đúng':
            response = { "text": "Cảm ơn bạn, bạn vui lòng chời một chút để nhân viên phẩn hồi nhé!" }
            break;
        case 'Không phải':
            response = { "text": "Tiếc quá, bạn hãy thử lại bằng hình hác nhé" }
            break;

        case 'RESTART_BOT':
        case 'GET_STARTED':
            await chatbotService.handleGetStarted(sender_psid);
            break;

        case 'SHOW_CATEGORY':
            await chatbotService.handleSendCategory(sender_psid);
            break;

        case 'ABOUT':
            await chatbotService.handleSendAbout(sender_psid);
            break;

        case 'SOMI':
            await chatbotService.handleSendShowSomi(sender_psid);
            break;
        case 'POLO':
            await chatbotService.handleSendShowPolo(sender_psid);
            break;
        case 'THUN':
            await chatbotService.handleSendShowThun(sender_psid);
            break;

        case 'BACK_TO_MAIN_CATEGORY':
            await chatbotService.handleBackToMainCategory(sender_psid)
            break;

        case 'HOT_PRODUCTS':
            await chatbotService.hotProducts(sender_psid)
            break;


        default:
            response = { "text": `oop! response: ${payload}` }
    }

    // callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
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

// ""
let setupProfile = async (req, res) => {
    let request_body = {
        "get_started": { "payload": "GET_STARTED" },
        "whitelisted_domains": ["https://test-chatbot-shop.herokuapp.com/"],
    }

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v14.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body)
        if (!err) {
            console.log('success')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

    return res.send("xin chao!")
}

let setupPersistentMenu = async (req, res) => {
    let request_body = {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "postback",
                        "title": "Talk to an agent",
                        "payload": "CARE_HELP"
                    },
                    {
                        "type": "web_url",
                        "title": "Tới shop",
                        "url": "https://a36480nguyenvanminh.vercel.app/",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "Khởi động lại bot",
                        "payload": "RESTART_BOT"
                    },
                ]
            }
        ]
    }

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v14.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body)
        if (!err) {
            console.log('set up persistent menu success')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

    return res.send("set up persistent menu success!")
}

let form = (req, res) => {
    let senderId = req.params.senderId;
    return res.render('form.ejs', {
        senderId: senderId
    });
}

let handlePostReserveTable = async (req, res) => {
    try {
        let username = await chatbotService.getUsername(req.body.psid);
        let data = {
            username: username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            customerName: req.body.customerName
        }
        await writeDataToGoogleSheet(data);

        let customerName = "";
        if (req.body.customerName === "") {
            customerName = username;
        } else customerName = req.body.customerName;

        let response1 = {
            "text": `---Thông tin khách hàng---
            \nHọ và tên: ${customerName}
            \nĐịa chỉ email: ${req.body.email}
            \nSố điện thoại: ${req.body.phoneNumber}
            `
        };

        await chatbotService.callSendAPI(req.body.psid, response1);

        return res.status(200).json({
            message: "ok"
        });
    } catch (e) {
        return res.status(500).json({
            message: "server error"
        });
    }
}

module.exports = {
    getHomePage: getHomePage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    form: form,
    setupPersistentMenu: setupPersistentMenu,
    handlePostReserveTable: handlePostReserveTable,
}