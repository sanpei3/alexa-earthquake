'use strict';
const AWS = require('aws-sdk');
const Alexa = require("alexa-sdk");

// please define "Environment variables " field at AWS lambda console
const APP_ID = process.env.ALEXA_APP_ID;

exports.handler = function(event, context, callback) {
	const alexa = Alexa.handler(event, context);
	alexa.appId = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};

function help(t) {
	const helpmsg = [
		"東京都の地震は、のように都道府県名を発音ください。",
		"東京都、のように都道府県名だけでも調べられます。",
		"データはP2P地震情報を一分おきに取得しています。都道府県名で質問ください。",
		"対応している地域は日本国内のみです。都道府県名で質問ください。",
		"終了方法は、終了と呼びかけてください。",
	];
	var help_num = Number(t.attributes['help_num']);
	if (isNaN(help_num)) {
		help_num = 0;
	}
	if (help_num >= helpmsg.length) {
		help_num = 0;
	}
	const result = helpmsg[help_num];
	t.attributes['help_num'] = help_num + 1;
	t.emit(':ask', result);

}

function prefToNumber(pref) {
	const preftable = [
		["1", "北海道", "ほっかい", "北海道", "ほっかいどう"],
		["2", "青森", "あおもり", "青森県", "あおもりけん"],
		["3", "岩手", "いわて", "岩手県", "いわてけん"],
		["4", "宮城", "みやぎ", "宮城県", "みやぎけん"],
		["5", "秋田", "あきた", "秋田県", "あきたけん"],
		["6", "山形", "やまがた", "山形県", "やまがたけん"],
		["7", "福島", "ふくしま", "福島県", "ふくしまけん"],
		["8", "茨城", "いばらき", "茨城県", "いばらきけん"],
		["9", "栃木", "とちぎ", "栃木県", "とちぎけん"],
		["10", "群馬", "ぐんま", "群馬県", "ぐんまけん"],
		["11", "埼玉", "さいたま", "埼玉県", "さいたまけん"],
		["12", "千葉", "ちば", "千葉県", "ちばけん"],
		["13", "東京", "とうきょう", "東京都", "とうきょうと"],
		["14", "神奈川", "かながわ", "神奈川県", "かながわけん"],
		["15", "新潟", "にいがた", "新潟県", "にいがたけん"],
		["16", "富山", "とやま", "富山県", "とやまけん"],
		["17", "石川", "いしかわ", "石川県", "いしかわけん"],
		["18", "福井", "ふくい", "福井県", "ふくいけん"],
		["19", "山梨", "やまなし", "山梨県", "やまなしけん"],
		["20", "長野", "ながの", "長野県", "ながのけん"],
		["21", "岐阜", "ぎふ", "岐阜県", "ぎふけん"],
		["22", "静岡", "しずおか", "静岡県", "しずおかけん"],
		["23", "愛知", "あいち", "愛知県", "あいちけん"],
		["24", "三重", "みえ", "三重県", "みえけん"],
		["25", "滋賀", "しが", "滋賀県", "しがけん"],
		["26", "京都", "きょうと", "京都府", "きょうとふ"],
		["27", "大阪", "おおさか", "大阪府", "おおさかふ"],
		["28", "兵庫", "ひょうご", "兵庫県", "ひょうごけん"],
		["29", "奈良", "なら", "奈良県", "ならけん"],
		["30", "和歌山", "わかやま", "和歌山県", "わかやまけん"],
		["31", "鳥取", "とっとり", "鳥取県", "とっとりけん"],
		["32", "島根", "しまね", "島根県", "しまねけん"],
		["33", "岡山", "おかやま", "岡山県", "おかやまけん"],
		["34", "広島", "ひろしま", "広島県", "ひろしまけん"],
		["35", "山口", "やまぐち", "山口県", "やまぐちけん"],
		["36", "徳島", "とくしま", "徳島県", "とくしまけん"],
		["37", "香川", "かがわ", "香川県", "かがわけん"],
		["38", "愛媛", "えひめ", "愛媛県", "えひめけん"],
		["39", "高知", "こうち", "高知県", "こうちけん"],
		["40", "福岡", "ふくおか", "福岡県", "ふくおかけん"],
		["41", "佐賀", "さが", "佐賀県", "さがけん"],
		["42", "長崎", "ながさき", "長崎県", "ながさきけん"],
		["43", "熊本", "くまもと", "熊本県", "くまもとけん"],
		["44", "大分", "おおいた", "大分県", "おおいたけん"],
		["45", "宮崎", "みやざき", "宮崎県", "みやざきけん"],
		["46", "鹿児島", "かごしま", "鹿児島県", "かごしまけん"],
		["47", "沖縄", "おきなわ", "沖縄県", "おきなわけん"],
	];
	if (pref == null) {
		return 0;
	}
	else if (isNaN(pref)) {
		var t;
		while ((t = preftable.pop())) {
			pref = pref.replace(new RegExp("^" + t[1] + ".*", "g"), t[0]);
			if (!isNaN(pref)) {
				return pref;
			}
			pref = pref.replace(new RegExp("^" + t[2] + ".*", "g"), t[0]);
			if (!isNaN(pref)) {
				return pref;
			}
		}
		return 0;
	}
	else {
		return pref;
	}
}


const handlers = {
	'LaunchRequest': function() {
		this.emit(':ask', 'ようこそ、地震スコープに、都道府県名で質問してください。');
	},
	'jishin': function() {
		if (this.event.request.intent == undefined) {
			this.emit(':ask', "すいません、聞き取れませんでした。もう一度、都道府県名で質問してください。");
			return;
		}
		var prefs = null;
		if (this.event.request.intent.slots["pref"]["resolutions"]["resolutionsPerAuthority"][0]["status"]["code"] != "ER_SUCCESS_MATCH") {
			prefs = prefToNumber(this.event.request.intent.slots.pref.value);
		} else {
			prefs = this.event.request.intent.slots["pref"]["resolutions"]["resolutionsPerAuthority"][0]["values"][0]["value"]["id"];
		}
		prefs = Number(prefs);
		if (prefs == null || prefs == 0) {
			this.emit(':ask', "都道府県名で質問してください。");
			return;
		}
		let self = this;
		var result = "HOGE";
		var documentClient = new AWS.DynamoDB.DocumentClient();
		const params = {
			TableName: "earthquake",
			Key: {
				"prefecture": prefs
			}
		};
		documentClient.get(params, function(err, data) {
			if (err) {
				console.error('Unable to get item. Error JSON:', JSON.stringify(err, null, 2));
				result = "すみません、システムエラーです。";
				self.emit(':tell', result);
			}
			else {
				result = data.Item.info.s;
				self.emit(':ask', result);
			}
		});
	},
	'AMAZON.HelpIntent': function() {
		help(this);
	},
	'AMAZON.CancelIntent': function() {
		this.response.speak('中止します。');
		this.emit(':responseReady');
	},
	'AMAZON.StopIntent': function() {
		this.response.speak('終了します。');
		this.emit(':responseReady');
	},
	Unhandled: function() {
		help(this);
	},
};
