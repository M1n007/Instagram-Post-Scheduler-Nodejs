const Insta = require('node-insta-web-api')
const InstaClient = new Insta();
const moment = require('moment');
const nodeSchedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const colors = require("./lib/colors");

//configuration
const config = require('./config/config');


const addPost = async (detailPost, index) => {
    const {caption, image} = detailPost;

    const photoPost = path.join(__dirname, image);

    const resultAddPost = await InstaClient.addPost(photoPost, caption);
    if (resultAddPost.status && resultAddPost.status == 'ok') {
        console.log(`[ ${moment().format("HH:mm:ss")} ] `,colors.FgGreen,
    `Sukses add post ke ${index}.`,
    colors.Reset);
    console.log('')
    }else{
        console.log(`[ ${moment().format("HH:mm:ss")} ] `,colors.FgRed,
    `gagal add post ${index}.`,
    colors.Reset);
    console.log('')
    }

};


(async () => {
    try{
        const {account, schedule} = config;
        
        if (fs.existsSync('./Cookies.json')) {
            await InstaClient.useExistingCookie();
        }else{
            await InstaClient.login(account.username, account.password);
        }

        for (let index = 0; index < schedule.length; index++) {
            const schedules = schedule[index];
            const newI = index+1;
            console.log(`[ ${moment().format("HH:mm:ss")} ] `,colors.FgGreen,`Mencoba mendambahkan post ke ${newI} pada jam ${schedules.timePost}`,colors.Reset);
            const hours = schedules.timePost.split(':')[0];
            const minute = schedules.timePost.split(':')[1];
            nodeSchedule.scheduleJob({hour: hours, minute: minute}, async () => {
                await addPost(schedules, newI);
                console.log(`Job ${newI} runs every day at ${schedules.timePost}`);
              });
        }
    }catch(e){
        console.log(e)
    }
})();