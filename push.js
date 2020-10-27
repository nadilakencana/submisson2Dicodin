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
   "endpoint": "https://fcm.googleapis.com/fcm/send/djphh8xuA0c:APA91bEN6NfMKFM3QtX_P26nSc11xMFK-fWSIJd_6sJvt0WkunFZaV8jkl1uYjNM2bskB4BKXy5IfTNerdFjMj2u5XrzzMZDykNYmtJ0acE29eRsSubJM0uQ3BgoJM2WBp0Z0x2r10l8",
   "keys": {
       "p256dh": "BJV81sV+Jh/WCa9asjDO+58h+fsnAiMPcwhcemi2e5yZM/YForLWbtIylvCgBPmo82L3JKhIpmbSMIX4489QKeI=",
       "auth":"ZcrW4VZNDp1hFhybzco2ww=="
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
