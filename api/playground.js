const nodemailer = require("nodemailer");
const db = require("./users.json");

// create reusable transport method (opens pool of SMTP connections)
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "noreply.qlabs@gmail.com",
        pass: "Nk8p5U{2C<)!FQ(#"
    }
});

transporter.verify(function(error, success) {
    if (error) {
        console.log("Transport is not ready");
        console.log(error);
    } else {
        console.log("Server is ready to take our messages [playground]");
    }
});

function sendOne(email) {
    // send user verification via email
    const mailOptions = {
        from: "Почтовый бот Qlabs <noreply@qlabs-edu.com>",
        to: email,
        subject: "Наши курсы теперь доступны на qlabs-edu.com",
        text: `APPLICANTS!!!
        Мы подготовили для вас почти настоящий NUFYPET!
        Не пропустите возможность проверить свои возможности перед экзаменом! Лучшая возможность проверить себя пока не поздно: 2 часа экзамена, мгновенный результат, решения задач, выявление своих слабых сторон! Все это всего за 1000 тенге!
        Все предметы!
        Доступ откроется 10 Февраля в 15:00 по времени Астаны. Экзамен можно пройти до 11 февраля 23:59 в любое удобное для вас время!
        Желаем хорошо подготовиться к экзаменам, команда Qlabs!`,
        html: `<p><b>APPLICANTS!!!</b></p>
        <p>Мы подготовили для вас почти настоящий NUFYPET!</p>
        <p>Не пропустите возможность проверить свои возможности перед экзаменом! Лучшая возможность проверить себя пока не поздно: 2 часа экзамена, мгновенный результат, решения задач, выявление своих слабых сторон! Все это всего за 1000 тенге!</p>
        <p>Все предметы!</p>
        <p>Доступ откроется <b>10 Февраля в 15:00</b> по времени Астаны. Экзамен можно пройти до <b>11 февраля 23:59</b> в любое удобное для вас время!</p>
        <p>Желаем хорошо подготовиться к экзаменам, команда Qlabs!</p>
        <img src="cid:unique@nodemailer.com"/>`,
        attachments: [
            {
                filename: "image.png",
                path: "./image.png",
                cid: "unique@nodemailer.com" //same cid value as in the html img src
            }
        ]
    };
    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Confirmation message sent to ${email}`);
        }
    });
}

// sendOne("finesome@gmail.com");

let i = 621;
async function doOne() {
    if (!db[i]) {
        return;
    }
    console.log(`Sending to ${db[i].email}`);
    if (i >= db.length) {
        return;
    }
    if (db[i].scope !== "admin") {
        sendOne(db[i].email);
        console.log("Sent you, next, next");
    }
    i++;
    setTimeout(doOne, 3000);
}

doOne();

// console.log(db.findIndex(x => x.email == "z_altynai2001@mail.ru"));
// console.log(db[621].email);
