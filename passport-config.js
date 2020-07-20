const LocalStrategy = require('passport-local').Strategy
const userModel = require('./models/userModel')
const bcrypt = require('bcrypt') 

  

//duzenleme yapacagimiz sinifi referans aliyoruz
function initialize(passport){
    
    //passport icin local yani bizim site icinde kayit olunacak diyoruz
    passport.use(new LocalStrategy(
        //giris yapilirken unique bir element lazim o buradaki username
        //username icin dogrulama burada password
        //dogrulamanin basarili olup olmadigini dondurmemiz icin gereken callback
        function(username, password, done) {
        
            /*
                done(err,result,options)
                
                err: yazilimsal olarak hata,Exception
                result: giris yapilan kullanicinin kendisi yoksa olmadigini belirtmek icin false
                options: eger err ve result yok ise giris hatasinin ozellikleri 
            */

            //  kullanicinin dogrulanmasi icin karsilastirilacak veri ,veri tabanindan alinacak. filtre olarak
            //  email ozelligini ayirt edici ozellik olarak bize verilen username ile karsilastirilip   
            //  sonucu (err,user)fonksiyonuna veriyoruz
            userModel.findOne({ email: username,isVerified:true },function (err, user) {

                //eger veritabanindaki islemde hata varsa
                if (err) {
                    //hatayi dondur
                    return done(err);
                }
                //eger veritabaninda bir kullanici bulunamadiysa 
                //eger kullanici null ise
                if (!user) {
                    //yazilimsal hata yok, kullanici yok,ozellikler{mesaj :'hatali kullanici adi'}
                    //diye dondur
                    return done(null, false, { message: 'Incorrect username Or not Verified Yet.' });
                }
                //buradan sonrasinda user tanimli yani bulunmus

                //bcrypt'de bize verilen(kullanicinin girdigi) ile veritabanindaki sifrelenmis sifreyi 
                //kontrol edip (err,result) metoduna veriyoruz
                bcrypt.compare(password,user.password,(err,result)=>{
                    
                    //hata var ise hatayi firlat
                    if (err) {throw err}
                        
                    //eger sifreler farkli ise
                    if(!result){
                        //yazilimsal hata yok, kullanici yok,ozellikler{mesaj :'hatali sifre'}
                        //diye dondur
                        return done(null, false, { message: 'Incorrect password.' });
                    
                    
                    }else{//eger sifreler farkli degilse ,ayni ise
                        //yazilimsal hata yok, kullanici var
                        //diye dondur
                        return done(null, user);
                        //burdan sonra user degiskenini RAM'e kaydetmek icin serializeUser methodu cagiriliyor
                    }
                }) 
            });
        }
    ));


    //kullanici serverin raminda tutarken
    passport.serializeUser((user,done)=>{
        
        /*
            done(err,kaydolacak verinin id'si (RAM'e))
        */
        
        //kullanicinin id'si ile RAM'e koyuyoruz
        done(null,user.id)   
    })

    
    //kullanici serverin ramindan cikartirken
    //kayitin omru bittiginde
    passport.deserializeUser(async(id,done)=>{
            /*
                done(err,silinecek verinin id'si(RAM'den) )
            */
    
            
           //veritabanindan bize verilen(daha onceden de bizim ona verdigim) id ile 
           //kullaniciyi buluyoruz ve RAM'den siliyoruz 
           return done(null,await userModel.findById(id))     
    })

    
}



module.exports = initialize