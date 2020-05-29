module.exports = {
//i used mlab database for fast and realiable pace development enviroment
   mongoURI: 'mongodb://localhost:27017/web-push',
   privateKey: 'SHuhP_wOiGmHsXYRjglX09-JsTSpBXbytCX1c_sGO9U' || process.env.VAPID_PRIVATE_KEY,
   publicKey: 'BGhvCO95Sh3NmsOker5aAeOARbMARDLpy5_YNVOAMxrvgI3NNj3u_pZJaslxWM60h-TcmPEZMZF9yGC6eCLYSnI' || process.env.VAPID_PUBLIC_KEY
}
