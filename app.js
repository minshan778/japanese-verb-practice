// ... (保留文件头部所有逻辑不变，直到 applyEntryPreset 函数)

function applyEntryPreset(entry) {
  applyingPreset = true;
  activeEntry = entry;
  // 这里删除了原来的 setVoiceTestLayout(entry === 'voice-test')
  // 语音测试逻辑现在只会执行默认的日常模式
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
    // ... (保持不变)
  } else if (entry === 'forms') {
    // ... (保持不变)
  } else if (entry === 'mistakes') {
    // ... (保持不变)
  }
  
  // 删除了 entry === 'voice-test' 的分支

  document.querySelectorAll('.entry-card').forEach(function(card) {
    card.classList.toggle('on', card.dataset.entry === entry);
  });
  // ... (其余代码保持不变)
}

// ... (找到 loadQuestion 函数，删除其中关于 activeEntry === 'voice-test' 的多余 UI 逻辑，保持简洁)

// ... (将最后一行 loadFixedVoiceManifest(); loadFixedChineseVoiceManifest(); 调用删掉，因为不再需要测试集)
