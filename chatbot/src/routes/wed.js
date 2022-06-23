import express from "express";
import homeController from "../controller/HomeController"

let router = express.Router();
let initWebroutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/form/:senderId', homeController.form);
    router.post('/reserve-table-ajax', homeController.handlePostReserveTable);

    router.post('/setup-profile', homeController.setupProfile)
    router.post('/setup-persistent-menu', homeController.setupPersistentMenu)

    router.post('/webhook', homeController.postWebhook);
    router.get('/webhook', homeController.getWebhook);

    return app.use('/', router);
}

module.exports = initWebroutes