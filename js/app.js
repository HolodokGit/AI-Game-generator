(function() {
    'use strict';

    const els = {
        prompt: document.getElementById('prompt'),
        genBtn: document.getElementById('genBtn'),
        harderBtn: document.getElementById('harderBtn'),
        easierBtn: document.getElementById('easierBtn'),
        log: document.getElementById('log'),
        frame: document.getElementById('frame'),
        placeholder: document.getElementById('placeholder'),
        history: document.getElementById('history'),
        histCount: document.getElementById('histCount'),
        meta: document.getElementById('meta')
    };

    const { analyze, GAME_LABELS, AUDIENCE_LABELS } = window.GameAnalyzer;
    const builders = {
        snake: window.GameSnake.build,
        clicker: window.GameClicker.build,
        runner: window.GameRunner.build
    };

    const state = {
        currentConfig: null,
        history: JSON.parse(localStorage.getItem('gameHistory') || '[]'),
        isGenerating: false
    };

    function log(text, color) {
        const div = document.createElement('div');
        div.style.color = color || '#10b981';
        div.textContent = '> ' + text;
        els.log.appendChild(div);
        els.log.scrollTop = els.log.scrollHeight;
    }

    function clearLog() { els.log.innerHTML = ''; }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function simulatePipeline(config) {
        const steps = [
            ['Парсинг естественноязыкового запроса...', '#94a3b8'],
            ['Определён жанр: ' + GAME_LABELS[config.genre], '#10b981'],
            ['Целевая аудитория: ' + AUDIENCE_LABELS[config.audience], '#10b981'],
            ['Сложность: ' + ['Простая', 'Стандартная', 'Высокая'][config.difficulty], '#10b981'],
            ['Генерация HTML5/Canvas кода...', '#f59e0b'],
            ['Сборка self-contained файла...', '#f59e0b'],
            ['Игра готова к запуску в WebView', '#10b981']
        ];
        for (const [msg, color] of steps) {
            log(msg, color);
            await sleep(180);
        }
    }

    function renderMeta(config) {
        els.meta.innerHTML = '';
        const parts = [
            ['Жанр', GAME_LABELS[config.genre]],
            ['Аудитория', AUDIENCE_LABELS[config.audience]],
            ['Сложность', ['Простая', 'Стандартная', 'Высокая'][config.difficulty]]
        ];
        parts.forEach(([k, v]) => {
            const span = document.createElement('span');
            span.innerHTML = k + ': <b>' + v + '</b>';
            els.meta.appendChild(span);
        });
    }

    function launchGame(config) {
        els.frame.srcdoc = builders[config.genre](config);
        els.frame.style.display = 'block';
        els.placeholder.style.display = 'none';
    }

    function renderHistory() {
        els.history.innerHTML = '';
        els.histCount.textContent = '(' + state.history.length + ')';
        if (state.history.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'color:var(--muted);font-size:11px;text-align:center;padding:8px;';
            empty.textContent = 'Пока пусто';
            els.history.appendChild(empty);
            return;
        }
        state.history.slice(0, 5).forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = 'history-item';
            const title = document.createElement('div');
            title.textContent = (idx + 1) + '. ' + item.prompt.slice(0, 30) + (item.prompt.length > 30 ? '...' : '');
            const badge = document.createElement('span');
            badge.textContent = GAME_LABELS[item.config.genre];
            el.appendChild(title);
            el.appendChild(badge);
            el.addEventListener('click', () => {
                state.currentConfig = item.config;
                launchGame(item.config);
                renderMeta(item.config);
                els.harderBtn.disabled = false;
                els.easierBtn.disabled = false;
                clearLog();
                log('Загружена игра из истории: ' + item.prompt, '#94a3b8');
            });
            els.history.appendChild(el);
        });
    }

    function saveToHistory(prompt, config) {
        state.history.unshift({ prompt, config, ts: Date.now() });
        state.history = state.history.slice(0, 10);
        localStorage.setItem('gameHistory', JSON.stringify(state.history));
        renderHistory();
    }

    async function generate() {
        const prompt = els.prompt.value.trim();
        if (!prompt || state.isGenerating) return;

        state.isGenerating = true;
        els.genBtn.disabled = true;
        els.genBtn.innerHTML = '<span class="spinner"></span>Генерация...';
        els.frame.style.display = 'none';
        els.placeholder.style.display = 'none';
        els.meta.innerHTML = '';
        clearLog();

        const config = analyze(prompt);
        state.currentConfig = config;

        await simulatePipeline(config);
        launchGame(config);
        renderMeta(config);
        saveToHistory(prompt, config);

        els.harderBtn.disabled = false;
        els.easierBtn.disabled = false;
        els.genBtn.disabled = false;
        els.genBtn.textContent = '⚡ Сгенерировать игру';
        state.isGenerating = false;
    }

    function adjustDifficulty(delta) {
        if (!state.currentConfig) return;
        const cfg = { ...state.currentConfig };
        cfg.difficulty = Math.max(0, Math.min(2, cfg.difficulty + delta));
        if (cfg.difficulty === state.currentConfig.difficulty) return;
        state.currentConfig = cfg;
        launchGame(cfg);
        renderMeta(cfg);
        clearLog();
        log('Итеративная доработка: сложность изменена на "' + ['Простая', 'Стандартная', 'Высокая'][cfg.difficulty] + '"', '#10b981');
    }

    els.genBtn.addEventListener('click', generate);
    els.harderBtn.addEventListener('click', () => adjustDifficulty(1));
    els.easierBtn.addEventListener('click', () => adjustDifficulty(-1));

    els.prompt.addEventListener('keydown', e => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate();
    });

    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            els.prompt.value = chip.dataset.p;
            els.prompt.focus();
        });
    });

    renderHistory();
})();