// ========== 变形引擎 ==========
var allForms = ['masu','te','ta','nai','potential','volitional','passive','causative','ba','imperative','causativePassive','prohibition'];
var formNames = {
  original:'原形（辞书形）', masu:'礼貌形（ます形）', te:'连接形（て形）', ta:'过去形（た形）', nai:'否定形（ない形）', potential:'可能形',
  volitional:'意志形', passive:'被动形', causative:'使役态', ba:'假定形（ば形）',
  imperative:'命令形', causativePassive:'使役被动形', prohibition:'禁止形（な）', classify:'动词区分'
};

var ruleTexts = {
  masu: { title:'礼貌形（ます形）', desc:'礼貌体，用于正式场合、对长辈或陌生人说话。', usage:'动词连用形+ます。否定形式是「ません」，过去形式是「ました」。', I:'一类动词：词尾う段→い段+ます\n例：書く→書きます、話す→話します\n注意：買う→買います（う→い）', II:'二类动词：去る+ます\n例：食べる→食べます', III:'三类动词：する→します\n来る→きます' },
  te: { title:'连接形（て形）', desc:'连接句子、表示动作进行中（〜ている）、请求（〜てください）等。', usage:'て形不能结句，需后接成分。①て+いる（正在做）②て+ください（请做）③て+から（做完后）。', I:'一类动词音便规则：\nく→いて（書く→書いて）\nぐ→いで（泳ぐ→泳いで）\nう・つ・る→って（買う→買って、待つ→待って、終わる→終わって）\nぬ・ぶ・む→んで（死ぬ→死んで、遊ぶ→遊んで、読む→読んで）\nす→して（話す→话して）\n⚠️ 例外：行く→行って', II:'二类动词：去る+て\n例：食べる→食べて', III:'三类动词：する→して\n来る→きて' },
  ta: { title:'过去形（た形）', desc:'表示动作已完成、过去发生的事。变形规则与て形完全相同，只是把て换成た、で换成だ。', usage:'①过去：昨日見た②完了：もう食べた③状态：壊れた。', I:'与て形规则相同，结尾变た/だ：書いた・泳いだ・買った・死んだ・話した\n⚠️ 行く→行った', II:'二类动词：去る+た\n例：食べる→食べた', III:'三类动词：する→した\n来る→きた' },
  nai: { title:'否定形（ない形）', desc:'表示"不…""没…"，是简体否定形式。', usage:'①否定陈述：行かない②请求否定：行かない递③必须：行かなければならない。', I:'一类动词：词尾う段→あ段+ない\n例：書く→書かない、話す→話さない\n⚠️ 買う→買わない（う→わ）\n⚠️ 特殊：ある→ない', II:'二类动词：去る+ない\n例：食べる→食べない', III:'三类动词：する→しない\n来る→こない' },
  potential: { title:'可能形（能／会）', desc:'表示"能…""会…""可以…"，有能力或条件做某事。', usage:'①能力：日本語が話せる②可能性：明日来られる③属性：この魚は食べられない。', I:'一类动词：词尾う段→え段+る（書ける、話せる）。注意：变化后的可能动词按二类动词变化。', II:'二类动词：去る+られる（食べられる）\n口语可省略ら：食べれる', III:'三类动词：する→できる\n来る→こられる' },
  volitional: { title:'意志形', desc:'表示"…吧""想要…""让我们一起…"，表达意志或劝诱。', usage:'①意志：明日早く起きよう②劝诱：一緒に行こう③〜と思う：留学しようと思う。', I:'一类动词：词尾う段→お段+う（書こう、話そう）', II:'二类动词：去る+よう（食べよう）', III:'三类动词：する→しよう\n来る→こよう' },
  passive: { title:'被动形', desc:'表示"被…""受到…"，主语承受动作。也用于尊敬或客观叙述。', usage:'①直接被动：先生に叱られた②受害：雨に降られた③尊敬：社長が来られた。', I:'一类动词：词尾う段→あ段+れる（書かれる、話される）', II:'二类动词：去る+られる（食べられる）※与可能形同形，靠语境区分', III:'三类动词：する→される\n来る→こられる' },
  causative: { title:'使役态', desc:'表示"让…做…""使…做…"，强制、指示或允许某人做某事。', usage:'①强制：母は私に部屋を掃除させた②允许：子供を遊ばせる③〜てください：行かせてください。', I:'一类动词：词尾う段→あ段+せる（書かせる、話させる）', II:'二类动词：去る+させる（食べさせる）', III:'三类动词：する→させる\n来る→こさせる' },
  ba: { title:'假定形（ば形）', desc:'表示"如果…""假如…"，用于条件假设。', usage:'①假设：お金があれば買う②必然：春になれば桜が咲く③建议：早く行けばよかった。', I:'一类动词：词尾う段→え段+ば（書けば、話せば）', II:'二类动词：去る+れば（食べれば）', III:'三类动词：する→すれば\n来る→くれば' },
  imperative: { title:'命令形', desc:'表示命令，语气非常强硬，多用于男性、紧急情况、口号或亲密关系之间。', usage:'①紧急：逃げろ！②口号：頑張れ！③交通标志：止まれ。日常建议用「〜てください」。', I:'一类动词：词尾う段→え段（書け、話せ）', II:'二类动词：去る+ろ（食べろ）', III:'三类动词：する→しろ（或せよ）\n来る→こい' },
  causativePassive: { title:'使役被动形', desc:'表示"被迫做…""不得不做…"，带有不情愿、被迫的语气。是使役态+被动形的结合。', usage:'①被迫：母に野菜を食べさせられた②不得不：会議に出させられた。', I:'一类动词：词尾う段→あ段+せられる（口语约音为される）\n例：書かせられる→書かされる', II:'二类动词：去る+させられる（食べさせられる）', III:'三类动词：する→させられる\n来る→こさせられる' },
  prohibition: { title:'禁止形', desc:'表示"不准…""禁止…"，语气非常强烈的否定命令。', usage:'①规则：ここでタバコを吸うな②警告：触るな！③标语：入るな。日常建议用「〜ないでください」。', I:'一类动词：辞书形+な（書くな）', II:'二类动词：辞书形+な（食べるな）', III:'三类动词：するな\n来る→くるな' }
};

function conjugate(verb, form) {
  var k = verb.kana, last = k[k.length-1];
  if (form === 'original') return k;
  var aRow = {う:'わ',く:'か',ぐ:'が',す:'さ',つ:'た',ぬ:'な',ぶ:'ば',む:'ま',る:'ら'};
  var iRow = {う:'い',く:'き',ぐ:'ぎ',す:'し',つ:'ち',ぬ:'に',ぶ:'び',む:'mi',る:'り'};
  var eRow = {う:'え',く:'け',ぐ:'げ',す:'せ',つ:'て',ぬ:'ね',ぶ:'べ',む:'め',る:'れ'};
  var oRow = {う:'お',く:'こ',ぐ:'ご',す:'そ',つ:'と',ぬ:'の',ぶ:'ぼ',む:'も',る:'ろ'};
  if (verb.exceptions && verb.exceptions[form]) return verb.exceptions[form];
  if (verb.type === 'II') {
    var stem = k.slice(0, -1);
    var map = { masu:'ます', te:'て', ta:'た', nai:'ない', potential:'られる', volitional:'よう',
      passive:'られる', causative:'させる', ba:'れば', imperative:'ろ', causativePassive:'させられる', prohibition:'るな' };
    return stem + (map[form] || '');
  }
  if (verb.type === 'III') {
    if (verb.kanji === '来る') {
      var fk = { masu:'きます', te:'きて', ta:'きた', nai:'こない', potential:'こられる',
        volitional:'こよう', passive:'こられる', causative:'こさせる', ba:'くれば', imperative:'こい',
        causativePassive:'こさせられる', prohibition:'くるな' };
      return fk[form] || '';
    } else {
      var sk = k.endsWith('する') ? k.slice(0, -2) : k;
      var base = (k === 'する') ? '' : sk;
      var fs = { masu:'します', te:'して', ta:'した', nai:'しない', potential:'できる',
        volitional:'しよう', passive:'される', causative:'させる', ba:'すれば', imperative:'しろ',
        causativePassive:'させられる', prohibition:'するな' };
      return base + (fs[form] || '');
    }
  }
  var stem = k.slice(0, -1);
  if (form === 'masu') return stem + iRow[last] + 'ます';
  if (form === 'nai') return stem + aRow[last] + 'ない';
  if (form === 'potential') return stem + eRow[last] + 'る';
  if (form === 'volitional') return stem + oRow[last] + 'う';
  if (form === 'passive') return stem + aRow[last] + 'れる';
  if (form === 'causative') return stem + aRow[last] + 'せる';
  if (form === 'ba') return stem + eRow[last] + 'ば';
  if (form === 'imperative') return stem + eRow[last];
  if (form === 'causativePassive') return stem + aRow[last] + 'せられる';
  if (form === 'prohibition') return k + 'な';
  if (form === 'te') {
    if (last === 'く') return stem + 'いて';
    if (last === 'ぐ') return stem + 'いで';
    if (last === 'す') return stem + 'して';
    if (last === 'う' || last === 'つ' || last === 'る') return stem + 'って';
    if (last === 'ぬ' || last === 'ぶ' || last === 'む') return stem + 'んで';
    return k + 'て';
  }
  if (form === 'ta') {
    if (last === 'く') return stem + 'いた';
    if (last === 'ぐ') return stem + 'いだ';
    if (last === 'す') return stem + 'した';
    if (last === 'う' || last === 'つ' || last === 'る') return stem + 'った';
    if (last === 'ぬ' || last === 'ぶ' || last === 'む') return stem + 'んだ';
    return k + 'た';
  }
  return '';
}

// ===== 输入转换 =====
var katakanaMap = {
  'ア':'あ','イ':'い','ウ':'う','エ':'え','オ':'お','カ':'か','キ':'き','ク':'く','ケ':'け','コ':'こ',
  'サ':'さ','シ':'し','ス':'す','セ':'せ','ソ':'そ','タ':'た','チ':'ち','ツ':'つ','テ':'て','ト':'と',
  'ナ':'な','ニ':'に','ヌ':'ぬ','ネ':'ね','ノ':'の','ハ':'は','ヒ':'ひ','フ':'ふ','ヘ':'へ','ホ':'ほ',
  'マ':'ま','ミ':'み','ム':'む','メ':'め','モ':'も','ヤ':'や','ユ':'ゆ','ヨ':'よ','ラ':'ら','リ':'り',
  'ル':'る','レ':'れ','ロ':'ろ','ワ':'わ','ヲ':'を','ン':'ん','ガ':'が','ギ':'ぎ','グ':'ぐ','ゲ':'げ',
  'ゴ':'ご','ザ':'ざ','ジ':'じ','ズ':'ず','ゼ':'ぜ','ゾ':'ぞ','ダ':'だ','ヂ':'ぢ','ヅ':'づ','デ':'で',
  'ド':'ど','バ':'ば','ビ':'び','ブ':'ぶ','ベ':'べ','ボ':'ぼ','パ':'ぱ','ピ':'ぴ','プ':'ぷ','ペ':'ぺ',
  'ポ':'ぽ','ャ':'ゃ','ュ':'ゅ','ョ':'ょ','ッ':'っ'
};
var romajiMap = {
  'a':'あ','i':'い','u':'う','e':'え','o':'お','ka':'か','ki':'き','ku':'く','ke':'け','ko':'こ',
  'sa':'さ','shi':'し','su':'す','se':'せ','so':'そ','ta':'た','chi':'ち','tsu':'つ','te':'て','to':'と',
  'na':'な','ni':'に','nu':'ぬ','ne':'ね','no':'の','ha':'は','hi':'ひ','fu':'ふ','he':'へ','ho':'ほ',
  'ma':'ま','mi':'み','mu':'む','me':'め','mo':'も','ya':'や','yu':'ゆ','yo':'よ','ra':'ら','ri':'り',
  'ru':'る','re':'れ','ro':'ろ','wa':'わ','wo':'を','n':'ん','ga':'が','gi':'ぎ','gu':'ぐ','ge':'げ',
  'go':'ご','za':'ざ','ji':'じ','zu':'ず','ze':'ぜ','zo':'ぞ','da':'だ','de':'で','do':'ど','ba':'ば',
  'bi':'び','bu':'ぶ','be':'べ','bo':'ぼ','pa':'ぱ','pi':'ぴ','pu':'ぷ','pe':'ぺ','po':'ぽ',
  'kya':'きゃ','kyu':'きゅ','kyo':'きょ','sha':'しゃ','shu':'しゅ','sho':'しょ','cha':'ちゃ','chu':'ちゅ',
  'cho':'ちょ','nya':'にゃ','nyu':'にゅ','nyo':'にょ','hya':'ひゃ','hyu':'ひゅ','hyo':'ひょ',
  'mya':'みゃ','myu':'みゅ','myo':'みょ','rya':'りゃ','ryu':'りゅ','ryo':'りょ','gya':'ぎゃ',
  'gyu':'ぎゅ','gyo':'ぎょ','ja':'じゃ','ju':'じゅ','jo':'じょ','bya':'びゃ','byu':'びゅ','byo':'びょ',
  'pya':'ぴゃ','pyu':'ぴゅ','pyo':'ぴょ','tte':'って','tta':'った','nde':'んで','nda':'んだ'
};
function buildKanjiMap() {
  var map = {};
  verbs.forEach(function(v) {
    map[v.kanji] = v.kana;
    if (v.type === 'II' || v.kanji === '来る') { map[v.kanji.slice(0,-1)] = v.kana.slice(0,-1); }
    if (v.type === 'III' && v.kanji !== '来る') { var s = v.kanji.replace('する',''); if(s) map[s] = v.kana.replace('する',''); }
  });
  return map;
}
var kanjiMap = buildKanjiMap();
function normalizeInput(input) {
  var str = input.trim();
  if (/^[a-zA-Z\s]+$/.test(str)) {
    str = str.toLowerCase().replace(/\s+/g, '');
    var out = '', i = 0;
    while (i < str.length) {
      var m = false;
      for (var l = 3; l >= 1; l--) {
        var sub = str.substring(i, i+l);
        if (romajiMap[sub]) { out += romajiMap[sub]; i += l; m = true; break; }
      }
      if (!m) { out += str[i]; i++; }
    }
    return out;
  }
  var kout = '';
  for (var j = 0; j < str.length; j++) { kout += katakanaMap[str[j]] || str[j]; }
  str = kout;
  var keys = Object.keys(kanjiMap).sort(function(a,b){return b.length-a.length;});
  for (var k = 0; k < keys.length; k++) {
    if (str.indexOf(keys[k]) !== -1) { str = str.replace(new RegExp(keys[k],'g'), kanjiMap[keys[k]]); }
  }
  return str;
}

// 保留汉字或假名原样比较，并统一全角、空格和片假名。
function normalizePlain(input) {
  var str = (input || '').normalize('NFKC').replace(/[\s　]/g, '');
  return str.replace(/[ァ-ヶ]/g, function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0x60); });
}

// 根据假名答案生成常用汉字写法，例如「かきます」→「書きます」。
function buildKanjiAnswer(verb, kanaAnswer) {
  if (verb.kanji === verb.kana) return kanaAnswer;
  if (verb.kanji === '来る') return '来' + kanaAnswer.slice(1);
  if (verb.type === 'III' && verb.kana.endsWith('する')) {
    var suruKanaStem = verb.kana.slice(0, -2);
    var suruKanjiStem = verb.kanji.slice(0, -2);
    return suruKanjiStem + kanaAnswer.slice(suruKanaStem.length);
  }
  var kanaStem = verb.kana.slice(0, -1);
  var kanjiStem = verb.kanji.slice(0, -1);
  return kanjiStem + kanaAnswer.slice(kanaStem.length);
}

function displayCorrectAnswer(verb, kanaAnswer) {
  var kanjiAnswer = buildKanjiAnswer(verb, kanaAnswer);
  return kanjiAnswer === kanaAnswer ? kanaAnswer : kanjiAnswer + '（' + kanaAnswer + '）';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function(ch) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
}

// 把中文原形释义按当前变形转换。分隔符只在括号外生效，
// 避免把「穿（鞋/裤）」这类说明错误拆开。
function mapMeaningSenses(meaning, transform) {
  var source = String(meaning || '');
  var parts = [], separators = [], buffer = '', depth = 0;
  for (var i = 0; i < source.length; i++) {
    var ch = source[i];
    if (ch === '（' || ch === '(') depth++;
    if (ch === '）' || ch === ')') depth = Math.max(0, depth - 1);
    if (depth === 0 && (ch === '、' || ch === '/' || ch === '／')) {
      parts.push(buffer.trim());
      separators.push(ch === '、' ? '、' : '／');
      buffer = '';
    } else {
      buffer += ch;
    }
  }
  parts.push(buffer.trim());
  var result = '';
  for (var j = 0; j < parts.length; j++) {
    result += transform(parts[j]);
    if (separators[j]) result += separators[j];
  }
  return result;
}

// 「了、吧」等放在自动/他动等补充说明之前：开（自动）→开了（自动）。
function appendBeforeMeaningNote(meaning, suffix) {
  var match = String(meaning).match(/^([\s\S]*?)([（(][^）)]*[）)])$/);
  return match ? match[1] + suffix + match[2] : meaning + suffix;
}

// 少数变形不能只靠“能／被／让”等前缀机械翻译。
// 这些内容跟随单词数据保存，既能显示“特殊翻译”标签，也能单独指定朗读文本。
function getMeaningOverride(verb, form) {
  if (!verb || !verb.meaningOverrides || !verb.meaningOverrides[form]) return null;
  var value = verb.meaningOverrides[form];
  if (typeof value === 'string') return { text:value, speech:value, special:false, sense:'' };
  return {
    text:value.text || '',
    speech:value.speech || value.text || '',
    special:!!value.special,
    sense:value.sense || ''
  };
}

function meaningForForm(verb, form) {
  var override = getMeaningOverride(verb, form);
  if (override && override.text) return override.text;
  var base = verb.meaning || '';
  var map = function(transform) { return mapMeaningSenses(base, transform); };
  if (form === 'classify') return base;
  if (form === 'masu') return base + '（礼貌表达）';
  if (form === 'te') return base + '……（连接后句，具体译法要看后项）';
  if (form === 'ta') return map(function(s) { return appendBeforeMeaningNote(s, '了'); });
  if (form === 'nai') return map(function(s) { return '不' + s; });
  if (form === 'potential') return map(function(s) { return '能' + s; });
  if (form === 'volitional') return map(function(s) { return appendBeforeMeaningNote(s, '吧'); });
  if (form === 'passive') {
    if (getTransitivity(verb) === 'vi') return '因“' + base + '”而受到影响（间接被动）';
    return map(function(s) { return '被' + s; });
  }
  if (form === 'causative') return map(function(s) { return '让（某人／某物）' + s; });
  if (form === 'ba') return map(function(s) { return '如果' + s; });
  if (form === 'imperative') return map(function(s) { return appendBeforeMeaningNote(s, '！'); });
  if (form === 'causativePassive') return map(function(s) { return '被迫' + s; });
  if (form === 'prohibition') return map(function(s) { return '不准' + s; });
  return base;
}

// 屏幕可以保留“礼貌表达”“连接后句”等学习说明，朗读时只读自然的中文意思。
function speechMeaningForForm(verb, form) {
  var override = getMeaningOverride(verb, form);
  if (override && override.speech) return override.speech;
  var base = verb.speechMeaning || verb.meaning || '';
  var map = function(transform) { return mapMeaningSenses(base, transform); };
  if (form === 'classify' || form === 'masu' || form === 'te') return base;
  if (form === 'ta') return map(function(s) { return appendBeforeMeaningNote(s, '了'); });
  if (form === 'nai') return map(function(s) { return '不' + s; });
  if (form === 'potential') return map(function(s) { return '能' + s; });
  if (form === 'volitional') return map(function(s) { return appendBeforeMeaningNote(s, '吧'); });
  if (form === 'passive') {
    if (getTransitivity(verb) === 'vi') return '因为“' + base + '”而受到影响';
    return map(function(s) { return '被' + s; });
  }
  if (form === 'causative') return map(function(s) { return '让某人' + s; });
  if (form === 'ba') return map(function(s) { return '如果' + s; });
  if (form === 'imperative') return base;
  if (form === 'causativePassive') return map(function(s) { return '被迫' + s; });
  if (form === 'prohibition') return map(function(s) { return '不准' + s; });
  return base;
}

function renderMeaningHtml(verb, form) {
  var isClassify = form === 'classify';
  var label = isClassify ? '🌏 原形的中文意思' : '🌏 ' + formNames[form] + '的中文意思';
  var html = '<span class="meaning-label">' + escapeHtml(label) + '</span>' +
    '<strong class="meaning-answer">' + escapeHtml(meaningForForm(verb, form)) + '</strong>';
  if (!isClassify && form !== 'original') {
    html += '<span class="meaning-origin">原形：' + escapeHtml(verb.kanji) + '（' + escapeHtml(verb.kana) + '）＝' + escapeHtml(verb.meaning) + '</span>';
  }
  return html;
}

// ===== 存储 =====
var mem = {}; try { mem = JSON.parse(localStorage.getItem('verb_mem')) || {}; } catch(e) {}
function saveMem() { try { localStorage.setItem('verb_mem', JSON.stringify(mem)); } catch(e) {} }
var errLog = []; try { errLog = JSON.parse(localStorage.getItem('verb_errlog')) || []; } catch(e) {}
function saveErrLog() { try { localStorage.setItem('verb_errlog', JSON.stringify(errLog)); } catch(e) {} }
// 新逻辑：题目出现时保持安静，只在答对后朗读“正确变形日语 → 中文”。
// 使用新的存储键，避免旧版“出题时朗读”的关闭状态影响新功能。
var autoSpeak = true;
try {
  var savedAnswerSpeak = localStorage.getItem('verb_answer_speak');
  if (savedAnswerSpeak !== null) autoSpeak = savedAnswerSpeak === '1';
} catch(e) {}
function saveSpeechSetting() { try { localStorage.setItem('verb_answer_speak', autoSpeak ? '1' : '0'); } catch(e) {} }

function readStoredNumber(key, fallback, min, max) {
  try {
    var value = parseFloat(localStorage.getItem(key));
    if (Number.isFinite(value) && value >= min && value <= max) return value;
  } catch(e) {}
  return fallback;
}

var japaneseVolume = readStoredNumber('verb_japanese_volume', 0.85, 0, 1);
var chineseVolume = readStoredNumber('verb_chinese_volume', 1, 0, 1);
var chineseRate = readStoredNumber('verb_chinese_rate', 0.88, 0.70, 1.05);

function saveAudioLevels() {
  try {
    localStorage.setItem('verb_japanese_volume', String(japaneseVolume));
    localStorage.setItem('verb_chinese_volume', String(chineseVolume));
    localStorage.setItem('verb_chinese_rate', String(chineseRate));
  } catch(e) {}
}

// ===== 应用状态 =====
var mode = 'new';
var selectedForms = allForms.slice();
var levels = ['N5','N4','N3','N2'];
var types = ['I','II','III'];
var transTypes = ['vi','vt'];
var usageFilters = ['high','normal'];
var examFilters = ['focus','common','supplement','pending'];
var formStatusFilters = ['core'];
var activeEntry = 'daily';
var applyingPreset = false;
var numPerRound = 10;
var pool = [], index = 0;
var okTotal = 0, ngTotal = 0;
var curVerb, curForm, curAnswer;
var answered = false;
var questionHadError = false;
var selectedClassType = '';
var selectedClassTrans = '';

// 当前固定语音的完整检查顺序。20个日语文件中，
// 「食べられる」「来られる」分别对应可能形和被动形，因此共有22个测试场景。
var voiceTestPlan = [
  {verb:'食べる', form:'original'},
  {verb:'食べる', form:'potential'},
  {verb:'食べる', form:'passive'},
  {verb:'食べる', form:'causativePassive'},
  {verb:'行く', form:'original'},
  {verb:'行く', form:'te'},
  {verb:'行く', form:'ta'},
  {verb:'来る', form:'nai'},
  {verb:'来る', form:'potential'},
  {verb:'来る', form:'passive'},
  {verb:'する', form:'original'},
  {verb:'する', form:'potential'},
  {verb:'読む', form:'original'},
  {verb:'読む', form:'te'},
  {verb:'書く', form:'original'},
  {verb:'書く', form:'ba'},
  {verb:'話す', form:'original'},
  {verb:'話す', form:'causativePassive'},
  {verb:'見る', form:'original'},
  {verb:'見る', form:'nai'},
  {verb:'起きる', form:'volitional'},
  {verb:'泳ぐ', form:'ta'}
];

// DOM
var prog = document.getElementById('progressBar');
var globalProg = document.getElementById('globalProgressBar');
var globalProgText = document.getElementById('globalProgressText');
var elVerb = document.getElementById('verb');
var elKana = document.getElementById('kana');
var elForm = document.getElementById('form');
var elVerbTags = document.getElementById('verbTags');
var elAns = document.getElementById('answer');
var elMsg = document.getElementById('msg');
var elSub = document.getElementById('submitBtn');
var elNext = document.getElementById('nextBtn');
var elInfo = document.getElementById('resultInfo');
var elMean = document.getElementById('meaning');
var elExam = document.getElementById('example');
var elOk = document.getElementById('ok');
var elNg = document.getElementById('ng');
var elRate = document.getElementById('rate');
var practiceArea = document.getElementById('practiceArea');
var resultArea = document.getElementById('resultArea');
var resultText = document.getElementById('resultText');
var ruleBtn = document.getElementById('ruleBtn');
var ruleBox = document.getElementById('ruleBox');
var errModal = document.getElementById('errModal');
var errList = document.getElementById('errList');
var settingsPanel = document.getElementById('settingsPanel');
var classifyArea = document.getElementById('classifyArea');
var presetNote = document.getElementById('presetNote');
var filterSummary = document.getElementById('filterSummary');
var pilotNote = document.getElementById('pilotNote');
var speakBtn = document.getElementById('speakBtn');
var autoSpeakChip = document.getElementById('autoSpeakChip');
var voiceStatus = document.getElementById('voiceStatus');
var japaneseVolumeInput = document.getElementById('japaneseVolume');
var japaneseVolumeValue = document.getElementById('japaneseVolumeValue');
var chineseVolumeInput = document.getElementById('chineseVolume');
var chineseVolumeValue = document.getElementById('chineseVolumeValue');
var chineseRateInput = document.getElementById('chineseRate');
var chineseRateValue = document.getElementById('chineseRateValue');
var normalPracticeControls = document.getElementById('normalPracticeControls');
var voiceTestScreen = document.getElementById('voiceTestScreen');
var voiceTestCounter = document.getElementById('voiceTestCounter');
var voiceTestProgressBar = document.getElementById('voiceTestProgressBar');
var exitVoiceTestBtn = document.getElementById('exitVoiceTestBtn');
var speechSupported = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
var audioSupported = typeof window.Audio === 'function';
var speechSequence = 0;
var fixedVoiceItems = {};
var fixedVoiceReady = false;
var fixedVoiceLoadFinished = false;
var fixedChineseVoiceItems = {};
var fixedChineseVoiceReady = false;
var fixedChineseVoiceLoadFinished = false;
var activeAudio = null;
var speechDelayTimer = null;

function safeAddEvent(el, event, fn) {
  if (el) el.addEventListener(event, function(e) { try { fn(e); } catch(err) { console.error(err); } });
}

// 语音能力标记为支持
function hasSpeechFeature() {
  return true;
}

function updateVoiceStatus(message) {
  if (voiceStatus) voiceStatus.textContent = message;
}

function refreshVoiceStatus() {
  updateVoiceStatus('已启用专属 Cloudflare Worker 微软 Edge 高清真人双语发音引擎。出题时静音，答对后先读正确变形，再读对应中文。');
}

function loadFixedVoiceManifest() {
  fixedVoiceLoadFinished = true;
  refreshVoiceStatus();
  renderSpeechSetting();
}

function loadFixedChineseVoiceManifest() {
  fixedChineseVoiceLoadFinished = true;
  refreshVoiceStatus();
}

function getJapaneseVoice() {
  return null;
}

function setSpeakingState(isSpeaking) {
  if (!speakBtn) return;
  speakBtn.classList.toggle('speaking', !!isSpeaking);
  speakBtn.setAttribute('aria-label', isSpeaking ? '正在朗读当前单词' : '朗读当前单词');
}

function stopActivePlayback() {
  if (speechDelayTimer !== null) {
    clearTimeout(speechDelayTimer);
    speechDelayTimer = null;
  }
  if (activeAudio) {
    activeAudio.onplay = null;
    activeAudio.onended = null;
    activeAudio.onerror = null;
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch(e) {}
    activeAudio = null;
  }
  if (speechSupported) window.speechSynthesis.cancel();
}

function stopSpeech() {
  speechSequence++;
  stopActivePlayback();
  setSpeakingState(false);
}

function finishSpeechStep(sequence, onComplete) {
  if (sequence !== speechSequence) return;
  setSpeakingState(false);
  if (typeof onComplete === 'function') onComplete(sequence);
}

// ========== 核心修复：100% 微软 Edge 高清发音中继请求 ==========
var workerUrl = "https://bitter-thunder-84ea.minshan2831.workers.dev/v1/audio/speech";

function speakWithWorkerVoice(text, lang, sequence, onComplete) {
  if (sequence !== speechSequence) {
    finishSpeechStep(sequence, onComplete);
    return;
  }

  // 核心纠正：lang === 'zh' 强制投送给中文女声，否则强制投送给日语女声，杜绝中日同声
  var targetVoice = (lang === 'zh') ? "zh-CN-XiaoxiaoNeural" : "ja-JP-NanamiNeural";

  var requestBody = {
    model: "tts-1",
    input: text,
    voice: targetVoice
  };

  window.fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer abc' // 假 Key 以避开前端格式检查
    },
    body: JSON.stringify(requestBody)
  })
  .then(function(response) {
    if (!response.ok) throw new Error('Worker 语音接口故障');
    return response.blob();
  })
  .then(function(blob) {
    if (sequence !== speechSequence) return;
    var audioUrl = window.URL.createObjectURL(blob);
    var audio = new window.Audio(audioUrl);
    activeAudio = audio;
    
    // 音量与语速动态调节
    audio.volume = (lang === 'zh') ? chineseVolume : japaneseVolume;
    if (lang === 'zh') {
      audio.playbackRate = chineseRate;
      audio._voiceLanguage = 'zh';
    } else {
      audio._voiceLanguage = 'ja';
    }

    audio.onplay = function() {
      if (sequence === speechSequence) setSpeakingState(true);
    };
    
    audio.onended = function() {
      window.URL.revokeObjectURL(audioUrl);
      if (sequence === speechSequence) {
        activeAudio = null;
        // 关键所在：日语播放完毕后，触发 finishSpeechStep 激发链条中的下一环中文播放！
        finishSpeechStep(sequence, onComplete);
      }
    };
    
    audio.onerror = function() {
      window.URL.revokeObjectURL(audioUrl);
      if (sequence === speechSequence) {
        activeAudio = null;
        if (lang === 'ja') {
          // 如果云端偶然失效，日语可降级到自带系统语音垫底
          speakWithBrowserVoice(text, sequence, onComplete);
        } else {
          finishSpeechStep(sequence, onComplete);
        }
      }
    };

    audio.play().catch(function() {
      if (sequence === speechSequence) {
        activeAudio = null;
        if (lang === 'ja') speakWithBrowserVoice(text, sequence, onComplete);
        else finishSpeechStep(sequence, onComplete);
      }
    });
  })
  .catch(function(err) {
    console.warn('Worker TTS 异常，改用系统语音 fallback:', err);
    if (lang === 'ja' && sequence === speechSequence) {
      speakWithBrowserVoice(text, sequence, onComplete);
    } else {
      finishSpeechStep(sequence, onComplete);
    }
  });
}

function speakWithBrowserVoice(text, sequence, onComplete) {
  if (!speechSupported || sequence !== speechSequence) {
    finishSpeechStep(sequence, onComplete);
    return;
  }
  var utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = japaneseVolume;
  var voice = getJapaneseVoice();
  if (voice) utterance.voice = voice;
  utterance.onstart = function() { if (sequence === speechSequence) setSpeakingState(true); };
  utterance.onend = utterance.onerror = function() { finishSpeechStep(sequence, onComplete); };
  window.speechSynthesis.speak(utterance);
}

function playFixedVoice(text, sequence, onComplete) {
  // 日语全线升级到 Worker 高清朗读，直接抛砖引玉
  return false;
}

function speakJapanese(text, onComplete) {
  if (!text) return;
  var sequence = ++speechSequence;
  stopActivePlayback();
  if (!hasSpeechFeature()) {
    finishSpeechStep(sequence, onComplete);
    return;
  }
  speakWithWorkerVoice(text, 'ja', sequence, onComplete);
}

function playFixedChineseVoice(text, sequence) {
  // 中文同样全线升级到 Worker
  return false;
}

function speakChinese(text, sequence) {
  if (!text || sequence !== speechSequence) {
    if (sequence === speechSequence) setSpeakingState(false);
    return;
  }
  setSpeakingState(false);
  // 完全保留并执行你原生的 260ms 防断连延时逻辑
  speechDelayTimer = setTimeout(function() {
    speechDelayTimer = null;
    if (sequence !== speechSequence) return;
    speakWithWorkerVoice(text, 'zh', sequence);
  }, 260);
}

function speakCorrectAnswer() {
  if (!answered || !curVerb || curForm === 'classify' || pool.length === 0 || index >= pool.length) return;
  var answerMeaning = speechMeaningForForm(curVerb, curForm);
  // 执行你的核心播放逻辑：首先播放日语，结束后触发回调播放中文，绝不同步
  speakJapanese(curAnswer, function(sequence) {
    speakChinese(answerMeaning, sequence);
  });
}

function renderSpeechSetting() {
  if (!autoSpeakChip) return;
  var available = hasSpeechFeature();
  autoSpeakChip.classList.toggle('on', autoSpeak && available);
  autoSpeakChip.setAttribute('aria-pressed', autoSpeak && available ? 'true' : 'false');
  autoSpeakChip.style.opacity = available ? '' : '.45';
  autoSpeakChip.style.cursor = available ? '' : 'not-allowed';
  autoSpeakChip.setAttribute('aria-disabled', available ? 'false' : 'true');
  autoSpeakChip.title = available ? '答对后自动朗读正确变形和中文' : '当前浏览器不支持语音朗读';
  if (speakBtn) {
    var canReplay = available && answered && curForm !== 'classify';
    speakBtn.disabled = !canReplay;
    speakBtn.title = !available ? '当前浏览器不支持语音朗读' : (canReplay ? '重播正确变形日语和中文' : '答对后可重播日语和中文');
    speakBtn.setAttribute('aria-label', canReplay ? '重播正确变形日语和中文' : '答对后可重播日语和中文');
  }
}

function toggleAutoSpeak() {
  if (!hasSpeechFeature()) return;
  autoSpeak = !autoSpeak;
  saveSpeechSetting();
  renderSpeechSetting();
  if (!autoSpeak) stopSpeech();
}

function renderAudioControls() {
  if (japaneseVolumeInput) japaneseVolumeInput.value = String(Math.round(japaneseVolume * 100));
  if (japaneseVolumeValue) japaneseVolumeValue.textContent = Math.round(japaneseVolume * 100) + '%';
  if (chineseVolumeInput) chineseVolumeInput.value = String(Math.round(chineseVolume * 100));
  if (chineseVolumeValue) chineseVolumeValue.textContent = Math.round(chineseVolume * 100) + '%';
  if (chineseRateInput) chineseRateInput.value = chineseRate.toFixed(2);
  if (chineseRateValue) chineseRateValue.textContent = chineseRate.toFixed(2) + '×';
}

function updateActiveAudioLevel() {
  if (!activeAudio) return;
  if (activeAudio._voiceLanguage === 'zh') {
    activeAudio.volume = chineseVolume;
    activeAudio.playbackRate = chineseRate;
  } else if (activeAudio._voiceLanguage === 'ja') {
    activeAudio.volume = japaneseVolume;
  }
}

function verbMetaText(verb) {
  var typeName = verb.type === 'I' ? '一类动词' : verb.type === 'II' ? '二类动词' : '三类动词';
  var trans = getTransitivity(verb);
  var transName = trans === 'vi' ? '自动词' : trans === 'vt' ? '他动词' : '自动词／他动词';
  return '（' + verb.kana + ' · ' + typeName + ' · ' + transName + (verb.exceptions ? ' · 特殊变化' : '') + '）';
}

function classificationText(verb) {
  return classificationTextByCodes(verb.type, getTransitivity(verb));
}

function classificationTextByCodes(type, trans) {
  var typeName = type === 'I' ? '一类动词' : type === 'II' ? '二类动词' : '三类动词';
  var transName = trans === 'vi' ? '自动词' : '他动词';
  return typeName + '＋' + transName;
}

function matchesVerbProfile(verb) {
  var profile = getVerbProfile(verb);
  return usageFilters.indexOf(profile.daily) !== -1 && examFilters.indexOf(profile.exam) !== -1;
}

function matchesFormStatus(verb, form) {
  return formStatusFilters.indexOf(getFormPracticeStatus(verb, form)) !== -1;
}

function setChipValues(selector, datasetKey, values) {
  document.querySelectorAll(selector + ' .chip').forEach(function(chip) {
    chip.classList.toggle('on', values.indexOf(chip.dataset[datasetKey]) !== -1);
  });
}

function setModeButtons(nextMode) {
  mode = nextMode;
  document.querySelectorAll('.mode-btn').forEach(function(btn) {
    btn.classList.toggle('on', btn.dataset.mode === nextMode);
  });
}

function markScopeCustom() {
  if (applyingPreset) return;
  activeEntry = 'custom';
  document.querySelectorAll('.entry-card').forEach(function(card) { card.classList.remove('on'); });
  presetNote.textContent = '自定义筛选：已按你当前选择的词频、考试重要度和变形价值出题。';
}

function setVoiceTestLayout(enabled) {
  if (normalPracticeControls) normalPracticeControls.classList.toggle('hidden', enabled);
  if (voiceTestScreen) voiceTestScreen.classList.toggle('hidden', !enabled);
}

function updateVoiceTestScreen() {
  if (activeEntry !== 'voice-test') return;
  var total = pool.length || voiceTestPlan.length;
  var current = total ? Math.min(index + 1, total) : 1;
  if (voiceTestCounter) voiceTestCounter.textContent = '第' + current + '/' + total + '题';
  if (voiceTestProgressBar) {
    voiceTestProgressBar.style.width = total ? Math.round((index / total) * 100) + '%' : '0%';
  }
}

function applyEntryPreset(entry) {
  applyingPreset = true;
  activeEntry = entry;
  setVoiceTestLayout(entry === 'voice-test');
  levels = ['N5','N4','N3','N2'];
  types = ['I','II','III'];
  transTypes = ['vi','vt'];
  selectedForms = allForms.slice();

  if (entry === 'daily') {
    usageFilters = ['high','normal'];
    examFilters = ['focus','common','supplement','pending'];
    formStatusFilters = ['core'];
    setModeButtons('new');
    presetNote.textContent = '日常核心：先练已标记的常用词和常用变形。';
    settingsPanel.classList.add('hidden');
  } else if (entry === 'jlpt') {
    usageFilters = ['high','normal','low','pending'];
    examFilters = ['focus','common'];
    formStatusFilters = ['core','exam'];
    setModeButtons('new');
    presetNote.textContent = 'JLPT重点：练初稿中的重点／常见词，并保留考试有价值的变形。';
    settingsPanel.classList.add('hidden');
  } else if (entry === 'forms') {
    usageFilters = ['high','normal','low','pending'];
    examFilters = ['focus','common','supplement','pending'];
    formStatusFilters = ['core','exam'];
    setModeButtons('new');
    presetNote.textContent = '变形专项：已打开详细筛选；低频变形仍默认关闭，可手动加入。';
    settingsPanel.classList.remove('hidden');
  } else if (entry === 'mistakes') {
    usageFilters = ['high','normal','low','pending'];
    examFilters = ['focus','common','supplement','pending'];
    formStatusFilters = ['core','exam','rare'];
    setModeButtons('error');
    presetNote.textContent = '错题强化：不受词频限制，集中重练已经答错的组合。';
    settingsPanel.classList.add('hidden');
  } else if (entry === 'voice-test') {
    usageFilters = ['high','normal','low','pending'];
    examFilters = ['focus','common','supplement','pending'];
    formStatusFilters = ['core','exam','rare'];
    setModeButtons('new');
    presetNote.textContent = '语音测试：固定22题，按顺序检查20个日语音频及其全部中文意思。';
    settingsPanel.classList.add('hidden');
  }

  document.querySelectorAll('.entry-card').forEach(function(card) {
    card.classList.toggle('on', card.dataset.entry === entry);
  });
  setChipValues('#usageChips', 'usage', usageFilters);
  setChipValues('#examChips', 'exam', examFilters);
  setChipValues('#formStatusChips', 'formStatus', formStatusFilters);
  setChipValues('#formChips', 'form', selectedForms);
  setChipValues('#levelChips', 'level', levels);
  setChipValues('#typeChips', 'type', types);
  setChipValues('#transChips', 'trans', transTypes);
  applyingPreset = false;
  rebuildPool();
}

function renderVerbTags(verb, form) {
  if (!elVerbTags) return;
  var profile = getVerbProfile(verb);
  var tags = [
    '<span class="meta-tag tag-level">' + escapeHtml(verb.level) + '</span>',
    '<span class="meta-tag tag-daily-' + profile.daily + '">' + escapeHtml(dailyProfileLabels[profile.daily]) + '</span>',
    '<span class="meta-tag tag-exam-' + profile.exam + '">' + escapeHtml(examProfileLabels[profile.exam]) + '</span>'
  ];
  if (activeEntry === 'voice-test') {
    tags.push('<span class="meta-tag tag-voice-test">语音测试 ' + (index + 1) + '/' + pool.length + '</span>');
  }
  if (form !== 'classify') {
    if (form !== 'original') {
      var status = getFormPracticeStatus(verb, form);
      var statusLabels = {core:'常用变形', exam:'考试保留', rare:'低频变形'};
      if (statusLabels[status]) tags.push('<span class="meta-tag tag-form-' + status + '">' + statusLabels[status] + '</span>');
    }
    var meaningOverride = getMeaningOverride(verb, form);
    if (meaningOverride && meaningOverride.special) {
      tags.push('<span class="meta-tag tag-special-translation">特殊翻译</span>');
    }
    if (meaningOverride && meaningOverride.sense) {
      tags.push('<span class="meta-tag tag-meaning-sense">词义：' + escapeHtml(meaningOverride.sense) + '</span>');
    }
  }
  elVerbTags.innerHTML = tags.join('');
}

function updateFilterSummary() {
  var verbCount = 0, combinationCount = 0;
  verbs.forEach(function(verb) {
    if (levels.indexOf(verb.level) === -1 || types.indexOf(verb.type) === -1 || !matchesTransitivity(verb) || !matchesVerbProfile(verb)) return;
    if (mode === 'classify') {
      if (getTransitivity(verb) !== 'both') { verbCount++; combinationCount++; }
      return;
    }
    var before = combinationCount;
    selectedForms.forEach(function(form) {
      if (isValidFormForVerb(verb, form) && matchesFormStatus(verb, form)) combinationCount++;
    });
    if (combinationCount > before) verbCount++;
  });
  if (filterSummary) filterSummary.textContent = '当前筛选：' + verbCount + ' 个动词 · ' + combinationCount + ' 个可练组合 · 每轮 ' + numPerRound + ' 题';
  if (pilotNote) {
    var profiledCount = verbs.filter(function(verb) { return !!verbProfiles[verb.kanji] || !!(verb.daily && verb.exam); }).length;
    pilotNote.textContent = '初稿已标记 ' + profiledCount + '/' + verbs.length + ' 个动词；未标记内容显示“待补充”。';
  }
}

// 快捷练习入口
document.querySelectorAll('.entry-card').forEach(function(card) {
  safeAddEvent(card, 'click', function() { applyEntryPreset(card.dataset.entry); });
});

// 折叠设置
safeAddEvent(document.getElementById('settingsToggle'), 'click', function() {
  settingsPanel.classList.toggle('hidden');
});

// 答对后自动朗读事件绑定
safeAddEvent(speakBtn, 'click', speakCorrectAnswer);
safeAddEvent(autoSpeakChip, 'click', toggleAutoSpeak);
safeAddEvent(autoSpeakChip, 'keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAutoSpeak(); }
});
safeAddEvent(japaneseVolumeInput, 'input', function() {
  japaneseVolume = Math.max(0, Math.min(1, parseInt(japaneseVolumeInput.value, 10) / 100));
  saveAudioLevels(); renderAudioControls(); updateActiveAudioLevel();
});
safeAddEvent(chineseVolumeInput, 'input', function() {
  chineseVolume = Math.max(0, Math.min(1, parseInt(chineseVolumeInput.value, 10) / 100));
  saveAudioLevels(); renderAudioControls(); updateActiveAudioLevel();
});
safeAddEvent(chineseRateInput, 'input', function() {
  chineseRate = Math.max(0.70, Math.min(1.05, parseFloat(chineseRateInput.value)));
  saveAudioLevels(); renderAudioControls(); updateActiveAudioLevel();
});

// 词频、考试重要度、变形练习价值筛选
document.querySelectorAll('#usageChips .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    chip.classList.toggle('on');
    usageFilters = [];
    document.querySelectorAll('#usageChips .chip.on').forEach(function(c) { usageFilters.push(c.dataset.usage); });
    markScopeCustom();
    rebuildPool();
  });
});
document.querySelectorAll('#examChips .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    chip.classList.toggle('on');
    examFilters = [];
    document.querySelectorAll('#examChips .chip.on').forEach(function(c) { examFilters.push(c.dataset.exam); });
    markScopeCustom();
    rebuildPool();
  });
});
document.querySelectorAll('#formStatusChips .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    chip.classList.toggle('on');
    formStatusFilters = [];
    document.querySelectorAll('#formStatusChips .chip.on').forEach(function(c) { formStatusFilters.push(c.dataset.formStatus); });
    markScopeCustom();
    rebuildPool();
  });
});

// 变形种类多选
document.querySelectorAll('#formChips .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    chip.classList.toggle('on');
    selectedForms = [];
    document.querySelectorAll('#formChips .chip.on').forEach(function(c) { selectedForms.push(c.dataset.form); });
    markScopeCustom();
    rebuildPool();
  });
});

// 模式
document.querySelectorAll('.mode-btn').forEach(function(btn) {
  safeAddEvent(btn, 'click', function() {
    document.querySelectorAll('.mode-btn').forEach(function(b){b.classList.remove('on');});
    btn.classList.add('on');
    mode = btn.dataset.mode;
    if ((activeEntry === 'mistakes' && mode !== 'error') || activeEntry === 'voice-test') markScopeCustom();
    rebuildPool();
  });
});

// 难度
document.querySelectorAll('#levelChips .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    chip.classList.toggle('on');
    levels = [];
    document.querySelectorAll('#levelChips .chip.on').forEach(function(c){levels.push(c.dataset.level);});
    markScopeCustom();
    rebuildPool();
  });
});

// 类型
document.querySelectorAll('#typeChips .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    chip.classList.toggle('on');
    types = [];
    document.querySelectorAll('#typeChips .chip.on').forEach(function(c){types.push(c.dataset.type);});
    markScopeCustom();
    rebuildPool();
  });
});

// 自动词／他动词
document.querySelectorAll('#transChips .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    chip.classList.toggle('on');
    transTypes = [];
    document.querySelectorAll('#transChips .chip.on').forEach(function(c){transTypes.push(c.dataset.trans);});
    markScopeCustom();
    rebuildPool();
  });
});

// 动词区分题的答案选择
document.querySelectorAll('#classTypeAnswers .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    document.querySelectorAll('#classTypeAnswers .chip').forEach(function(c){c.classList.remove('on');});
    chip.classList.add('on'); selectedClassType = chip.dataset.answerType;
  });
});
document.querySelectorAll('#classTransAnswers .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    document.querySelectorAll('#classTransAnswers .chip').forEach(function(c){c.classList.remove('on');});
    chip.classList.add('on'); selectedClassTrans = chip.dataset.answerTrans;
  });
});

// 数量
document.querySelectorAll('#numChips .chip').forEach(function(chip) {
  safeAddEvent(chip, 'click', function() {
    document.querySelectorAll('#numChips .chip').forEach(function(c){c.classList.remove('on');});
    chip.classList.add('on');
    numPerRound = parseInt(chip.dataset.num);
    rebuildPool();
  });
});

// 规则按钮
safeAddEvent(ruleBtn, 'click', function() {
  ruleBox.classList.toggle('hidden');
  var r = ruleTexts[curForm];
  if (r) {
    var typeKey = curVerb.type === 'I' ? 'I' : curVerb.type === 'II' ? 'II' : 'III';
    var typeName = curVerb.type === 'I' ? '一类动词（五段）' : curVerb.type === 'II' ? '二类动词（一段）' : '三类动词（不规则）';
    ruleBox.innerHTML = '<strong>📖 ' + r.title + '</strong><br><br>💬 <em>含义：</em>' + r.desc + '<br><br>📝 <em>用法：</em>' + r.usage + '<br><br>🔧 <em>' + typeName + '的变化方法：</em><br>' + r[typeKey].replace(/\n/g, '<br>');
  }
});

// 错题本
safeAddEvent(document.getElementById('errBookBtn'), 'click', function() {
  errModal.classList.remove('hidden');
  renderErrList();
});
safeAddEvent(document.getElementById('closeErrBtn'), 'click', function() { errModal.classList.add('hidden'); });
safeAddEvent(document.getElementById('clearErrBtn'), 'click', function() {
  errLog = [];
  Object.keys(mem).forEach(function(key) {
    mem[key].wrong = 0;
    mem[key].errorStreak = 0;
  });
  saveMem(); saveErrLog(); renderErrList(); rebuildPool();
});

function renderErrList() {
  if (!errList) return;
  if (errLog.length === 0) { errList.innerHTML = '<p style="color:#888;font-size:0.7rem;">暂无错题</p>'; return; }
  var html = '';
  for (var i = 0; i < errLog.length; i++) {
    var e = errLog[i];
    html += '<div class="err-item"><span><strong>' + escapeHtml(e.verb) + '</strong> ' + escapeHtml(formNames[e.form] || e.form) + '<br>❌' + escapeHtml(e.user) + ' → ✅' + escapeHtml(e.correct) + '</span><button class="retry-err-btn" data-index="' + i + '">练习</button></div>';
  }
  errList.innerHTML = html;
  errList.querySelectorAll('.retry-err-btn').forEach(function(btn) {
    safeAddEvent(btn, 'click', function() { retryErrItem(parseInt(btn.dataset.index)); });
  });
}

function retryErrItem(i) {
  var e = errLog[i]; if(!e) return;
  for (var j = 0; j < verbs.length; j++) {
    if (verbs[j].kanji === e.verb) {
      mode = 'error';
      document.querySelectorAll('.mode-btn').forEach(function(b){b.classList.toggle('on', b.dataset.mode === 'error');});
      pool = [{verb:verbs[j], form:e.form}]; index = 0;
      okTotal = 0; ngTotal = 0;
      errModal.classList.add('hidden'); practiceArea.classList.remove('hidden'); resultArea.classList.add('hidden');
      loadQuestion(true);
      break;
    }
  }
}

function updateGlobalProgress() {
  var total = 0, practiced = 0;
  verbs.forEach(function(v) {
    if (levels.indexOf(v.level) === -1 || types.indexOf(v.type) === -1 || !matchesTransitivity(v) || !matchesVerbProfile(v)) return;
    for (var i = 0; i < selectedForms.length; i++) {
      if (!isValidFormForVerb(v, selectedForms[i]) || !matchesFormStatus(v, selectedForms[i])) continue;
      total++;
      var key = v.kanji + '_' + selectedForms[i];
      if (mem[key]) practiced++;
    }
  });
  globalProgText.textContent = practiced + '/' + total;
  globalProg.style.width = total ? Math.round((practiced / total) * 100) + '%' : '0%';
}

function findVerbForVoiceTest(kanji) {
  for (var i = 0; i < verbs.length; i++) {
    if (verbs[i].kanji === kanji) return verbs[i];
  }
  return null;
}

function rebuildVoiceTestPool() {
  stopSpeech();
  pool = [];
  okTotal = 0;
  ngTotal = 0;
  elOk.textContent = '0';
  elNg.textContent = '0';
  elRate.textContent = '-';

  voiceTestPlan.forEach(function(item) {
    var verb = findVerbForVoiceTest(item.verb);
    if (verb) pool.push({verb:verb, form:item.form, voiceTest:true});
  });

  index = 0;
  updateProgress();
  practiceArea.classList.remove('hidden');
  resultArea.classList.add('hidden');

  if (pool.length === voiceTestPlan.length) {
    loadQuestion(true);
  } else {
    elVerb.textContent = '语音测试数据不完整';
    elKana.textContent = '请检查测试动词是否仍在单词表中';
    if (elVerbTags) elVerbTags.innerHTML = '';
    elForm.textContent = '';
    elAns.blur();
    elAns.disabled = true;
  }
  updateGlobalProgress();
}

function rebuildPool() {
  if (activeEntry === 'voice-test') {
    rebuildVoiceTestPool();
    return;
  }
  stopSpeech();
  pool = [];
  okTotal = 0; ngTotal = 0;
  elOk.textContent = '0'; elNg.textContent = '0'; elRate.textContent = '-';
  verbs.forEach(function(v) {
    if (levels.indexOf(v.level) === -1 || types.indexOf(v.type) === -1 || !matchesTransitivity(v) || !matchesVerbProfile(v)) return;
    if (mode === 'classify') {
      if (getTransitivity(v) !== 'both') pool.push({verb:v, form:'classify'});
      return;
    }
    selectedForms.forEach(function(f) {
      if (!isValidFormForVerb(v, f) || !matchesFormStatus(v, f)) return;
      var key = v.kanji + '_' + f;
      if (mode === 'new' && !mem[key]) pool.push({ verb: v, form: f });
      else if (mode === 'review' && mem[key]) pool.push({ verb: v, form: f });
      else if (mode === 'error' && mem[key] && mem[key].wrong > 0) pool.push({ verb: v, form: f });
    });
    var classifyKey = v.kanji + '_classify';
    if (mode === 'error' && getTransitivity(v) !== 'both' && mem[classifyKey] && mem[classifyKey].wrong > 0) {
      pool.push({verb:v, form:'classify'});
    }
  });
  updateFilterSummary();
  pool.sort(function() { return Math.random() - 0.5; });
  if (pool.length > numPerRound) pool = pool.slice(0, numPerRound);
  index = 0;
  updateProgress();
  if (pool.length > 0) {
    practiceArea.classList.remove('hidden');
    resultArea.classList.add('hidden');
    loadQuestion(false);
  } else {
    elVerb.textContent = '暂无题目';
    elKana.textContent = mode === 'error' ? '当前筛选范围内还没有错题' : '请调整筛选条件或切换练习方式';
    if (elVerbTags) elVerbTags.innerHTML = '';
    elForm.textContent = '';
    elAns.blur();
    elAns.disabled = true;
  }
  updateGlobalProgress();
}

function updateProgress() {
  if (pool.length === 0) prog.style.width = '0%';
  else prog.style.width = Math.round((index / pool.length) * 100) + '%';
  updateVoiceTestScreen();
}

function focusAnswerWithoutScroll() {
  try { elAns.focus({preventScroll:true}); }
  catch(e) { elAns.focus(); }
}

function loadQuestion(autoFocus) {
  if (typeof autoFocus === 'undefined') autoFocus = true;
  if (index >= pool.length) { showResult(); return; }
  stopSpeech();
  var item = pool[index];
  curVerb = item.verb; curForm = item.form;
  curAnswer = curForm === 'classify' ? curVerb.type + '|' + getTransitivity(curVerb) : conjugate(curVerb, curForm);
  elVerb.textContent = curVerb.kanji;
  elKana.textContent = curForm === 'classify' ? '（' + curVerb.kana + (curVerb.exceptions ? ' · 特殊变化' : '') + '）' : verbMetaText(curVerb);
  renderVerbTags(curVerb, curForm);
  elForm.textContent = formNames[curForm] + (activeEntry === 'voice-test' ? ' · ' + (index + 1) + '/' + pool.length : '');
  selectedClassType = ''; selectedClassTrans = '';
  document.querySelectorAll('#classifyArea .chip').forEach(function(c){c.classList.remove('on');});
  if (curForm === 'classify') {
    classifyArea.classList.remove('hidden'); elAns.classList.add('hidden'); ruleBtn.style.display = 'none';
  } else {
    classifyArea.classList.add('hidden'); elAns.classList.remove('hidden'); ruleBtn.style.display = curForm === 'original' ? 'none' : '';
    elAns.value = ''; elAns.className = ''; elAns.disabled = false;
    if (autoFocus) focusAnswerWithoutScroll();
    else elAns.blur();
  }
  elMsg.innerHTML = ''; elSub.style.display = ''; elSub.textContent = '决定';
  elNext.classList.add('hidden'); elInfo.classList.add('hidden'); ruleBox.classList.add('hidden');
  answered = false;
  questionHadError = false;
  renderSpeechSetting();
  updateProgress();
}

function checkAns() {
  if (answered) return;
  var isClassify = curForm === 'classify';
  var isVoiceTest = activeEntry === 'voice-test';
  var raw = isClassify ? selectedClassType + '|' + selectedClassTrans : elAns.value.trim();
  if (isClassify && (!selectedClassType || !selectedClassTrans)) {
    elMsg.innerHTML = '<span class="red">请分别选择活用分类和自他分类</span>'; return;
  }
  if (!raw) return;
  var ua = isClassify ? raw : normalizeInput(raw);
  var plain = isClassify ? raw : normalizePlain(raw);
  var kanjiAnswer = isClassify ? '' : buildKanjiAnswer(curVerb, curAnswer);
  var correct = isClassify ? raw === curAnswer : (ua === curAnswer || plain === normalizePlain(curAnswer) || plain === normalizePlain(kanjiAnswer));
  var key = curVerb.kanji + '_' + curForm;
  if (!isVoiceTest && !mem[key]) mem[key] = { correct: 0, wrong: 0, errorStreak: 0 };
  if (correct) {
    if (!questionHadError) {
      okTotal++;
      if (!isVoiceTest) {
        mem[key].correct++;
        if (mode === 'error' && mem[key].wrong > 0) {
          mem[key].errorStreak = (mem[key].errorStreak || 0) + 1;
          if (mem[key].errorStreak >= 2) {
            mem[key].wrong = 0;
            mem[key].errorStreak = 0;
            errLog = errLog.filter(function(e){return !(e.verb === curVerb.kanji && e.form === curForm);});
            saveErrLog();
          }
        }
      }
    }
    if (!isVoiceTest) saveMem();
    elMsg.innerHTML = '<span class="green">✔ ' + (questionHadError ? '纠正正确！' : '正确！') + '</span>';
    elSub.style.display = 'none'; elNext.classList.remove('hidden');
    elMean.innerHTML = renderMeaningHtml(curVerb, curForm);
    if (isVoiceTest) {
      elExam.textContent = '🎧 语音测试 ' + (index + 1) + '/' + pool.length + '：先读正确日语，再读对应中文。';
    } else {
      elExam.textContent = isClassify ? '📎 分类：' + classificationText(curVerb) : '📎 例：' + (curVerb.example || curVerb.kanji + 'の' + formNames[curForm] + 'は ' + curAnswer + ' です');
    }
    elInfo.classList.remove('hidden');
    answered = true;
    renderSpeechSetting();
    // 只在答对后依次朗读正确变形和对应中文；不再朗读出题原形。
    if ((autoSpeak || isVoiceTest) && !isClassify) {
      speakCorrectAnswer();
    }
  } else {
    if (!questionHadError) {
      ngTotal++;
      if (!isVoiceTest) {
        mem[key].wrong++;
        mem[key].errorStreak = 0;
        var oldIndex = -1;
        for (var i = 0; i < errLog.length; i++) {
          if (errLog[i].verb === curVerb.kanji && errLog[i].form === curForm) { oldIndex = i; break; }
        }
        if (oldIndex >= 0) errLog.splice(oldIndex, 1);
        errLog.unshift({ verb: curVerb.kanji, form: curForm, user: isClassify ? classificationTextByCodes(selectedClassType, selectedClassTrans) : raw, correct: isClassify ? classificationText(curVerb) : displayCorrectAnswer(curVerb, curAnswer) });
        if (errLog.length > 50) errLog.pop();
        saveMem(); saveErrLog();
      }
    }
    questionHadError = true;
    elMsg.innerHTML = '<span class="red">✘ 错误，正确答案：' + escapeHtml(isClassify ? classificationText(curVerb) : displayCorrectAnswer(curVerb, curAnswer)) + '<br>请重新回答正确答案</span>';
    if (isClassify) {
      selectedClassType = ''; selectedClassTrans = '';
      document.querySelectorAll('#classifyArea .chip').forEach(function(c){c.classList.remove('on');});
    } else {
      elAns.className = 'wrong'; elAns.value = ''; focusAnswerWithoutScroll();
    }
    elSub.textContent = '重试';
    answered = false;
  }
  elOk.textContent = okTotal; elNg.textContent = ngTotal;
  var total = okTotal + ngTotal;
  elRate.textContent = total ? Math.round((okTotal / total) * 100) : '-';
  if (!isVoiceTest) updateGlobalProgress();
}

function nextQ() { index++; loadQuestion(true); }

function showResult() {
  stopSpeech();
  practiceArea.classList.add('hidden');
  resultArea.classList.remove('hidden');
  var total = pool.length;
  var rate = total ? Math.round((okTotal / total) * 100) : 0;
  resultText.textContent = '共 ' + total + ' 题，首次答对 ' + okTotal + ' 题，首次正确率 ' + rate + '%';
  if (activeEntry === 'voice-test') {
    if (voiceTestCounter) voiceTestCounter.textContent = '第' + total + '/' + total + '题 · 已完成';
    if (voiceTestProgressBar) voiceTestProgressBar.style.width = '100%';
  }
}

safeAddEvent(elSub, 'click', checkAns);
safeAddEvent(elNext, 'click', nextQ);
safeAddEvent(exitVoiceTestBtn, 'click', function() { applyEntryPreset('daily'); });
safeAddEvent(elAns, 'keydown', function(e) {
  if (e.key === 'Enter') {
    if (!elNext.classList.contains('hidden')) nextQ();
    else checkAns();
  }
});
safeAddEvent(document.getElementById('retryBtn'), 'click', function() { rebuildPool(); });
safeAddEvent(document.getElementById('resetBtn'), 'click', function() {
  practiceArea.classList.remove('hidden');
  resultArea.classList.add('hidden');
  if (activeEntry === 'voice-test') applyEntryPreset('daily');
  else rebuildPool();
});

renderAudioControls();
renderSpeechSetting();
loadFixedVoiceManifest();
loadFixedChineseVoiceManifest();
applyEntryPreset('daily');
elOk.textContent = okTotal; elNg.textContent = ngTotal; elRate.textContent = '-';
