
//


// ****************************************************************************
// 活动ID配置项目
const vas = [

    "1000001123,11051839",//100豆7.6
    "1000419411,11044608",//50豆7.7/100豆7.14
    "749081,11041075",//50豆7.7/100豆7.14
    "12124939,11055579",//50豆7.7/100豆7.22
    "1000390122,11053252",//100豆7.8
    "1000075741,11051996",//100豆7.8
    "751737,11054061",//100豆7.8
    "10392088,11056193",//5天100豆7.8
    "10179647,11054509",//7天5元7.9
    "1000362844,11055620",//7天1元7.9
    "12337596,11054354",//50豆7.9/100豆7.16
    "10542232,11055850",//2元7.10
    "72639,11049791",//100豆7.10
    "10418688,11032868",//60豆7.10
    "10344276,11056184",//50豆7.10
    "832071,11056191",//50豆7.10
    "1000325166,11046799",//100豆7.14
    "1000421133,11047472",//100豆7.15
    "1000385605,11042642",//1元7.15

];
// ****************************************************************************

const $ = hammer("测试", 3);

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

function hammer(t="untitled",l=3){return new class{constructor(t,l){this.name=t,this.logLevel=l,this.isRequest=("object"==typeof $request)&&$request.method!="OPTIONS",this.isSurge="undefined"!=typeof $httpClient,this.isQuanX="undefined"!=typeof $task,this.isNode="function"==typeof require,this.node=(()=>{if(!this.isNode){return null}const file="localstorage.yml";let f,y,r;try{f=require('fs');y=require('js-yaml');r=require('request');f.appendFile(file,"",function(err){if(err)throw err;})}catch(e){console.log("install unrequired module by: yarn add module_name");console.log(e.message);return{}}return{file:file,fs:f,yaml:y,request:r,}})()}log(...n){if(l<2){return null}console.log(`\n***********${this.name}***********`);for(let i in n)console.log(n[i])}alert(body="",subtitle="",options={}){if(l==2||l==0){return null}if(typeof options=="string"){options={"open-url":options}}let link=null;if(Object.keys(options).length){link=this.isQuanX?options:{openUrl:options["open-url"],mediaUrl:options["media-url"]}}if(this.isSurge)return $notification.post(this.name,subtitle,body,link);if(this.isQuanX)return $notify(this.name,subtitle,body,link);console.log(`系统通知📣\ntitle:${this.name}\nsubtitle:${subtitle}\nbody:${body}\nlink:${link}`)}request(method,params,callback){let options={};if(typeof params=="string"){options.url=params}else{options.url=params.url;if(typeof params=="object"){params.headers&&(options.headers=params.headers);params.body&&(options.body=params.body)}}method=method.toUpperCase();const writeRequestErrorLog=function(n,m,u){return err=>console.log(`${n}request error:\n${m} ${u}\n${err}`)}(this.name,method,options.url);if(this.isSurge){const _runner=method=="GET"?$httpClient.get:$httpClient.post;return _runner(options,(error,response,body)=>{if(error==null||error==""){response.body=body;callback("",body,response)}else{writeRequestErrorLog(error);callback(error,"",response)}})}options.method=method;if(this.isQuanX){$task.fetch(options).then(response=>{response.status=response.statusCode;delete response.statusCode;callback("",response.body,response)},reason=>{writeRequestErrorLog(reason.error);response.status=response.statusCode;delete response.statusCode;callback(reason.error,"",response)})}if(this.isNode){if(options.method=="POST"&&options.body){try{options.body=JSON.parse(options.body);options.json=true}catch(e){console.log(e.message)}}this.node.request(options,(error,response,body)=>{if(typeof body=="object"){body=JSON.stringify(body)}if(typeof response=='object'&&response){response.status=response.statusCode;delete response.statusCode}callback(error,body,response)})}}read(key){if(this.isSurge)return $persistentStore.read(key);if(this.isQuanX)return $prefs.valueForKey(key);if(this.isNode){let val="";try{const fileContents=this.node.fs.readFileSync(this.node.file,"utf8");const data=this.node.yaml.safeLoad(fileContents);val=(typeof(data)=="object"&&data[key])?data[key]:""}catch(e){console.log(`读取文件时错误:\n${e.message}`);return""}return val}}write(val,key){if(this.isSurge)return $persistentStore.write(val,key);if(this.isQuanX)return $prefs.setValueForKey(val,key);if(this.isNode){try{const fileContents=this.node.fs.readFileSync(this.node.file,"utf8");let data=this.node.yaml.safeLoad(fileContents);data=typeof data=="object"?data:{};data[key]=val;val=this.node.yaml.safeDump(data);this.node.fs.writeFileSync(this.node.file,val,'utf8')}catch(e){console.log(e.message);return false}return true}}delete(key){if(this.isNode){try{const fileContents=this.node.fs.readFileSync(this.node.file,"utf8");let data=this.node.yaml.safeLoad(fileContents);data=typeof data=="object"?data:{};if(!data.hasOwnProperty(key)){return true}delete data[key];const val=this.node.yaml.safeDump(data);this.node.fs.writeFileSync(this.node.file,val,'utf8')}catch(e){console.log(e.message);return false}return true}}done(value={}){if(this.isQuanX)return this.isRequest?$done(value):null;if(this.isSurge)return this.isRequest?$done(value):$done()}pad(s=false,c="*",l=15){return s?this.log(c.padEnd(l,c)):`\n${c.padEnd(l,c)}\n`}}(t,l)}
