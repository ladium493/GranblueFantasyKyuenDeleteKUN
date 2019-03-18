function main(){
  const idList = getGuraburuHelpTweets();
  if(idList.length <= 0){
    Logger.log('さくじょなし');
    return;
  }
  var errorCount = 0;
  idList.forEach(function(id){
    try{
       destroyTweet(id);
    }catch(e){
      errorCount = errorCount + 1;
    }
  })
  var message = '救援ツイートの削除を'+ String(idList.length) +'件実行しました'
  
  //削除でerrorをキャッチしていた場合
  if(errorCount >= 1){
    message = message + '\r\nうち、'+ String(errorCount)+'件の削除に失敗しました。'
  }
  
  post(message)
}

//自分のツイートを1000件取得し、その中から救援ツイートを見つけツイートIDのリストを作成する
function getGuraburuHelpTweets(){
  
  var service  = twitter.getService();
  var idList = [];
  var max_id = '';
  
  //一度の取得が最大200件までなので5回繰り返す
  for(var i = 0; i <= 5 ; i++){
    var response = service.fetch('https://api.twitter.com/1.1/statuses/user_timeline.json?count=200'+max_id);
    var tweets = JSON.parse(response);
    
    tweets.forEach(function(tweet){
      if(tweet['text'].indexOf('参加者募集！') != -1){
        idList.push(tweet['id_str'])
      }
    });
    //取得した一覧の最後のツイートIDをパラメータに設定する。
    max_id = '&max_id='+tweets[String(tweets.length-1)]['id_str']
  }
  
  return idList;
}

//IDを元にツイートの削除を行う
function destroyTweet(id){
  var service  = twitter.getService();
  var response = service.fetch('https://api.twitter.com/1.1/statuses/destroy/'+id+'.json',{
                               method: 'post'
                               });
  }

// ツイート投稿
function post(text) {
  var service  = twitter.getService();
  var response = service.fetch('https://api.twitter.com/1.1/statuses/update.json', {
    method: 'post',
    payload: { status: text }
  }); 
  Logger.log(response)
}

//認証通ってるか確認用
function postTest(){
  var dateStr = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'HH時mm分ss秒');
  post("TEST:"+dateStr)
}
