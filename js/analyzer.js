window.GameAnalyzer = (function() {
    'use strict';

    const GAME_LABELS = { snake: 'Змейка', clicker: 'Кликер', runner: 'Аркада' };
    const AUDIENCE_LABELS = { grandma: 'Бабушка', kids: 'Дети', default: 'Стандарт' };

    function analyze(prompt) {
        const p = prompt.toLowerCase();
        const config = { genre: null, audience: 'default', difficulty: 1 };

        if (/(змей|snake|змейк)/.test(p)) config.genre = 'snake';
        else if (/(клик|click|тапан|кнопк)/.test(p)) config.genre = 'clicker';
        else if (/(аркад|раннер|runner|уклонен|убег|dodge|избег)/.test(p)) config.genre = 'runner';
        else config.genre = ['snake', 'clicker', 'runner'][Math.floor(Math.random() * 3)];

        if (/(бабуш|дедушк|старш|пожил|больш)/.test(p)) config.audience = 'grandma';
        else if (/(дет|ребен|малыш|ярк)/.test(p)) config.audience = 'kids';

        if (/(сложн|хардкор|hard|быстр|скорост)/.test(p)) config.difficulty = 2;
        else if (/(легк|прост|easy|медлен)/.test(p)) config.difficulty = 0;

        return config;
    }

    return { analyze, GAME_LABELS, AUDIENCE_LABELS };
})();