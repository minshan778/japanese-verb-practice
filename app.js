// ========== 全纯净版 Worker 双语真人发音引擎 ==========
var workerUrl = "https://holy-silence-088a.minshan2831.workers.dev/v1/audio/speech";

function speakWithWorkerVoice(text, lang, sequence, onComplete) {
  if (sequence !== speechSequence) {
    finishSpeechStep(sequence, onComplete);
    return;
  }

  // lang === 'zh' 用 shimmer（中文），否则用 alloy（日语真人声）
  var requestBody = {
    model: "tts-1",
    input: text,
    voice: lang === 'zh' ? 'shimmer' : 'alloy'
  };

  window.fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer abc'
    },
    body: JSON.stringify(requestBody)
  })
  .then(function(response) {
    if (!response.ok) throw new Error('Worker 语音合成失败');
    return response.blob();
  })
  .then(function(blob) {
    if (sequence !== speechSequence) return;
    var audioUrl = window.URL.createObjectURL(blob);
    var audio = new window.Audio(audioUrl);
    activeAudio = audio;
    
    // 绑定对应的音量和语速
    audio.volume = lang === 'zh' ? chineseVolume : japaneseVolume;
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
        finishSpeechStep(sequence, onComplete);
      }
    };
    audio.onerror = function() {
      window.URL.revokeObjectURL(audioUrl);
      if (sequence === speechSequence) {
        activeAudio = null;
        finishSpeechStep(sequence, onComplete);
      }
    };
    audio.play().catch(function() {
      if (sequence === speechSequence) {
        activeAudio = null;
        finishSpeechStep(sequence, onComplete);
      }
    });
  })
  .catch(function(err) {
    console.error('Worker 发音失败:', err);
    finishSpeechStep(sequence, onComplete);
  });
}

function speakJapanese(text, onComplete) {
  if (!text) return;
  var sequence = ++speechSequence;
  stopActivePlayback();
  if (!hasSpeechFeature()) {
    finishSpeechStep(sequence, onComplete);
    return;
  }
  // 日语不再找本地或系统声音，100% 逼真度走 Worker
  speakWithWorkerVoice(text, 'ja', sequence, onComplete);
}

function speakChinese(text, sequence) {
  if (!text || sequence !== speechSequence) {
    if (sequence === speechSequence) setSpeakingState(false);
    return;
  }
  setSpeakingState(false);
  speechDelayTimer = setTimeout(function() {
    speechDelayTimer = null;
    if (sequence !== speechSequence) return;
    // 中文同样 100% 走 Worker
    speakWithWorkerVoice(text, 'zh', sequence);
  }, 260);
}
