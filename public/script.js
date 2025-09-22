document.addEventListener('DOMContentLoaded', () => {
    const platformSelect = document.getElementById('platform');
    const customPlatformInput = document.getElementById('customPlatform');
    const toneSelect = document.getElementById('tone');
    const customToneInput = document.getElementById('customTone');
    const customInput = document.getElementById('customInput');
    const generateBtn = document.getElementById('generateBtn');
    const spinner = document.getElementById('spinner');
    const outputDiv = document.getElementById('output');
    const copyBtn = document.getElementById('copyBtn');
    const historyList = document.getElementById('history');
    const targetAudienceSelect = document.getElementById('targetAudience');
    const customAudienceInput = document.getElementById('customAudience');
    const keywordsInput = document.getElementById('keywords');
    const ctaSelect = document.getElementById('cta');
    const customCtaInput = document.getElementById('customCta');
    const lengthRadios = document.querySelectorAll('input[name="length"]');
    const customLengthWrapper = document.getElementById('customLengthWrapper');
    const customLengthInput = document.getElementById('customLength');

    const API_ENDPOINT = '/api/generate'; // Use relative path for deployment

    // --- Functions ---
    function setOutputPlaceholder() {
        outputDiv.innerHTML = '請在左側輸入條件並點擊生成...';
        outputDiv.classList.add('placeholder');
    }

    function updateHistoryUI() {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<li class="list-group-item text-muted">暫無紀錄</li>';
            return;
        }
        history.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
            
            const textSpan = document.createElement('span');
            textSpan.textContent = item.substring(0, 60) + (item.length > 60 ? '...' : '');
            textSpan.style.cursor = 'pointer';
            textSpan.style.flexGrow = '1';
            textSpan.style.marginRight = '10px';
            textSpan.onclick = () => {
                outputDiv.textContent = item;
                outputDiv.classList.remove('placeholder'); // Remove placeholder class
                copyBtn.style.display = 'block';
            };
    
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.style.border = 'none';
            deleteBtn.onclick = (event) => {
                event.stopPropagation();
                history.splice(index, 1);
                localStorage.setItem('generationHistory', JSON.stringify(history));
                updateHistoryUI();
            };
    
            li.appendChild(textSpan);
            li.appendChild(deleteBtn);
            historyList.appendChild(li);
        });
    }

    function addToHistory(text) {
        history.unshift(text);
        if (history.length > 5) {
            history.pop();
        }
        localStorage.setItem('generationHistory', JSON.stringify(history));
        updateHistoryUI();
    }

    // --- Initial Setup ---
    let history = JSON.parse(localStorage.getItem('generationHistory')) || [];
    updateHistoryUI();
    setOutputPlaceholder(); // Set initial placeholder

    // --- Event Listeners ---
    platformSelect.addEventListener('change', () => {
        customPlatformInput.style.display = platformSelect.value === 'custom' ? 'block' : 'none';
    });

    toneSelect.addEventListener('change', () => {
        customToneInput.style.display = toneSelect.value === 'custom' ? 'block' : 'none';
    });

    targetAudienceSelect.addEventListener('change', () => {
        customAudienceInput.style.display = targetAudienceSelect.value === 'custom' ? 'block' : 'none';
    });

    ctaSelect.addEventListener('change', () => {
        customCtaInput.style.display = ctaSelect.value === 'custom' ? 'block' : 'none';
    });

    lengthRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (document.querySelector('input[name="length"]:checked').value === 'custom') {
                customLengthWrapper.style.display = 'block';
            } else {
                customLengthWrapper.style.display = 'none';
            }
        });
    });

    generateBtn.addEventListener('click', async () => {
        const getCustomValue = (select, input) => {
            return select.value === 'custom' ? input.value.trim() : select.value;
        };

        const platform = getCustomValue(platformSelect, customPlatformInput);
        const tone = getCustomValue(toneSelect, customToneInput);
        const targetAudience = getCustomValue(targetAudienceSelect, customAudienceInput);
        const cta = getCustomValue(ctaSelect, customCtaInput);
        const keywords = keywordsInput.value.trim();
        
        let length;
        const selectedLengthRadio = document.querySelector('input[name="length"]:checked');
        if (selectedLengthRadio.value === 'custom') {
            const customLength = customLengthInput.value.trim();
            if (!customLength || parseInt(customLength) < 10) {
                alert('請輸入有效的自訂字數（至少 10 個字）。');
                return;
            }
            length = `約 ${customLength} 字`;
        } else {
            length = selectedLengthRadio.value;
        }

        if ((platformSelect.value === 'custom' && !platform) ||
            (toneSelect.value === 'custom' && !tone) ||
            (targetAudienceSelect.value === 'custom' && !targetAudience) ||
            (ctaSelect.value === 'custom' && !cta)) {
            alert('請輸入所有的自訂欄位。');
            return;
        }

        const requestBody = {
            platform, length, tone, targetAudience, keywords, cta,
            customInput: customInput.value
        };

        spinner.style.display = 'inline-block';
        generateBtn.disabled = true;
        outputDiv.textContent = '生成中，請稍候...';
        outputDiv.classList.remove('placeholder'); // Remove placeholder class
        copyBtn.style.display = 'none';

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '請求失敗');
            }

            const data = await response.json();
            outputDiv.textContent = data.generatedText;
            copyBtn.style.display = 'block';
            
            addToHistory(data.generatedText);

        } catch (error) {
            outputDiv.textContent = `發生錯誤：${error.message}`;
            if (!outputDiv.textContent.trim()) {
                setOutputPlaceholder();
            }
        } finally {
            spinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputDiv.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已複製！';
            copyBtn.classList.add('btn-success');
            copyBtn.classList.remove('btn-secondary');

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('btn-success');
                copyBtn.classList.add('btn-secondary');
            }, 2000);
        }, () => {});
    });
});
