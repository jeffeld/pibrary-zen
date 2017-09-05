const config = {
    database: process.env.MONGODB,
    from: process.env.EMAIL_FROM, // 'Pipers Hill Library <phcollibrary@gmail.com>',
};


const mongojs = require('mongojs');
const db      = mongojs(config.database, ['emails']);

const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_SES_REGION
});

const nodemailer  = require('nodemailer');
const transporter = nodemailer.createTransport({

    SES: new AWS.SES({
        apiVersion: '2010-12-01'
    })

});

const program = require("commander");
const moment  = require("moment");

function log(m) {
    console.log([moment().format('HH:mm:ss'), m].join('\t'));
}

async function getEmails() {

    const p = new Promise((resolve, reject) => {

        db.emails.find({status: 'pending'}, (err, emails) => {

            if (err) {
                reject(err);
            } else {
                log(`${emails.length} found`);
                resolve(emails);
            }

        });

    });

    return p;
}


async function updateEmail (email, state) {

    return new Promise ((resolve, reject) => {

        const now = new Date();

        db.emails.update(
            {_id: email._id},
            {
                $set: {
                    status: state,
                    lastUpdated: now
                }
            }
       );

       resolve ();

    });

}

async function sendEmail(email) {

    const p = new Promise((resolve, reject) => {

        const mo = {
            to: email.to,
            from: config.from,
            subject: email.subject,
            html: email.body
        };

        transporter.sendMail(mo, function (err, response) {
            if (err) {
                log(`Send to ${email.to} failed with ${reason}`);
                updateEmail(email, "failed");
                reject(err);
            } else {
                log (`Success: to ${email.to}`);
                updateEmail(email, "sent");
                resolve(response);
            }
        });

    });

    return p;
}


async function sendEmails(emails) {


    const allPromises = [];

    emails.forEach((email) => {
        const p = sendEmail(email);
        allPromises.push(p);
    });

    return Promise.all(allPromises);

}

async function entryPoint(verb) {

    try {

        log("Begin");
        const emails = await getEmails();
        await sendEmails(emails);
        log("End");
        process.exit(0);

    } catch (e) {
        log(`Fatal: ${e}`);
        process.exit(1);

    }


}

program
    .arguments("<verb>")
    .option("-l, --live", "Run in a live environment; actually send emails to recipient")
    .action(entryPoint)
    .parse(process.argv);





