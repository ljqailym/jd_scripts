

// cookie用JD签到的


// ****************************************************************************
// 活动ID配置项目
const vas = [
         "1000161261,10410146",//2天50豆100份6.24
         "10015314,10408903",//3天50京豆 100份6.24
         "1000108429,10407109",//100豆6.25
         "10054491,10407173",//7天100豆100份6.27
         "10261250,10406861",//15天100豆100份7.5
         "10093102,10408797",//7天100豆100份6.29
         "826065,10408466",//7天100豆100份6.29
         "1000329431,10410130",//3天100豆100份6.25
         "10166342,10410493",//3天50豆200份6.25
         "1000000829,10409485",//3天10豆6.25/7天100豆6.29 50份
         "1000002685,10409924",//7天50豆100份6.29
         "722560,10409761,//3天20豆6.25
         "1000337102,10410461",//3天20豆6.25
];
// ****************************************************************************
const $ = hammer("店铺签到", 3);

let results = ["左滑 / 下拉 查看详细结果..."];

let options = {
    url: "",
    headers: {
        Cookie: $.read('CookieJD'),
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Mobile/15E148 Safari/604.1",
        "referer": "https://h5.m.jd.com/",
    }
};

function checkCookie(){
    return new Promise(resolve => {
        if(!options.headers.Cookie){
            $.alert("Cookie不存在，中止运行.");
            return resolve(false);
        }
        options.url = "https://plogin.m.jd.com/cgi-bin/ml/islogin";
        $.request("GET", options, (err, resp, data) => {
            if(err){
                $.log(err);
                $.alert("Cookie检测异常，查看日志");
                return resolve(false);
            }
            resp = JSON.parse(resp);
            if(resp.islogin == 1){
                return resolve(true);
            }
            $.log(resp);
            $.alert("Cookie已失效");
            return resolve(false);
        })
    })
}

// ****************************************************************************
function buildOptions(va){
    return new Promise(resolve => {
        const nowTs = Date.now();
        const [v, a] = va.split(",", 2);
        options.url = `https://api.m.jd.com/api?appid=interCenter_shopSign&t=${nowTs}&loginType=2&functionId=interact_center_shopSign_signCollectGift&body=%7B%22token%22%3A%2293F80D2F93AD3591911610FE675280E%22%2C%22venderId%22%3A${v}%2C%22activityId%22%3A${a}%2C%22type%22%3A56%2C%22actionType%22%3A7%7D`;
        $.request("GET", options, (err, resp, data) => {
            if(err){
                $.log(`<${va}>签到异常`, err);
                results.push(`${va} ×`);
                return resolve();
            }
            resp = JSON.parse(resp);
            if(!resp.success){
                $.log(resp);
                results.push(`${va} ×\n（${resp.msg}）`);
                return resolve();
            }
            results.push(`${va} √`);
            setTimeout(()=>{
                return resolve();
            }, 1234)
        })
    })
}

async function dailySign(){
    if (!await checkCookie()) {
        return $.done();
    }
    $.log("JDCookie校验完成，开始签到");
    for (const va of vas) {
        await buildOptions(va);
    }
    $.alert(results.join("\n"), "签到结束");
    $.done();
}


$.isRequest ? $.done() : dailySign();

function hammer(t="untitled",l=3){return new class{constructor(t,l){this.name=t,this.logLevel=l,this.isRequest=("object"==typeof $request)&&$request.method!="OPTIONS",this.isSurge="undefined"!
