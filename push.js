var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BM7iNmfTI76iddwB_FjeAodfjgtMVnzP_nmESuYpzkMPx_VW25TQfQkOZWBXLMtUz2IFF6UGLpjFGCXWrhjZ8eQ",
   "privateKey": "fLvX-sv-2u-mygkxXpFa8ClwxfC5HEvcF-nfo796K0E"
};
 
webPush.setVapidDetails(
   'mailto:nurhadinubi@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/foR9eJq9ljY:APA91bERMEuKMtCuGwKlnGkkDcxUZ8aWcaF7FXUPHHxdviu2XtV5-cb8dioMBEY7su1B4jc_ps6ZjPx9NcesUqk1i7lO_VhxbzM5rrMCVltj8EeeMp5ZywRUSKca0hZ1YTHECYDbtCg5",
   "keys": {
       "p256dh": "BGk11xVhgGUangR2aCZPxCbjadd8ghegPfILXTVxULyKAk8OOx1po4QaRmep9kXHgsYizhZvVAEgTuLDl2/022A=",
       "auth": "wDRGEBKkdAeYB4sXNc7UDQ=="
   }
};
let payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
let options = {
   gcmAPIKey: '713976774038',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);
