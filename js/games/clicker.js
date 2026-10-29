window.GameClicker = (function() {
    'use strict';

    function build(config) {
        const aud = config.audience;
        const diff = config.difficulty;
        const isGrandma = aud === 'grandma';
        const isKids = aud === 'kids';

        const palette = isKids
            ? { bg: '#fff7e6', fg: '#ff6b35', accent: '#4ecdc4', text: '#222', title: '🌈 Весёлая игра' }
            : isGrandma
                ? { bg: '#fafafa', fg: '#2c3e50', accent: '#e74c3c', text: '#000', title: '🎮 Простая игра' }
                : { bg: '#1e293b', fg: '#ffcc00', accent: '#10b981', text: '#fff', title: '🎮 Игра' };

        const font = isGrandma ? '20px' : isKids ? '18px' : '15px';

        return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
            body{margin:0;background:${palette.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:${palette.text};user-select:none;overflow:hidden;}
            h2{margin:0 0 20px;font-size:${font};}
            #score{font-size:${isGrandma ? '48px' : '40px'};font-weight:bold;margin-bottom:20px;color:${palette.fg};}
            #target{
                width:${isGrandma ? '220px' : '160px'};height:${isGrandma ? '220px' : '160px'};
                border-radius:50%;background:${palette.accent};cursor:pointer;
                display:flex;align-items:center;justify-content:center;
                font-size:${isGrandma ? '80px' : '60px'};color:#fff;
                transition:transform 0.05s;box-shadow:0 8px 24px rgba(0,0,0,0.15);
            }
            #target:active{transform:scale(0.92);}
            #timer{margin-top:20px;font-size:${isGrandma ? '22px' : '18px'};color:${palette.text};}
            .pop{position:absolute;pointer-events:none;font-weight:bold;color:${palette.fg};animation:float 0.8s ease-out forwards;}
            @keyframes float{to{transform:translateY(-60px);opacity:0;}}
        </style></head><body>
            <h2>${palette.title} — Кликер</h2>
            <div id="score">0</div>
            <div id="target">🎯</div>
            <div id="timer">Осталось: 20с</div>
            <script>
                const PALETTE = ${JSON.stringify(palette)};
                const DIFF = ${diff};
                const timeLimit = ${isGrandma ? 30 : isKids ? 20 : 20} + DIFF * 5;
                let score = 0, timeLeft = timeLimit, over = false;
                const scoreEl = document.getElementById('score');
                const targetEl = document.getElementById('target');
                const timerEl = document.getElementById('timer');

                targetEl.addEventListener('click', e => {
                    if(over) return;
                    score++;
                    scoreEl.textContent = score;
                    const pop = document.createElement('div');
                    pop.className = 'pop';
                    pop.textContent = '+1';
                    pop.style.left = e.clientX + 'px';
                    pop.style.top = e.clientY + 'px';
                    pop.style.fontSize = '${isGrandma ? '28px' : '22px'}';
                    document.body.appendChild(pop);
                    setTimeout(() => pop.remove(), 800);
                });

                const iv = setInterval(() => {
                    if(over) return;
                    timeLeft--;
                    timerEl.textContent = 'Осталось: ' + timeLeft + 'с';
                    if(timeLeft <= 0){
                        over = true;
                        clearInterval(iv);
                        targetEl.style.background = '#666';
                        targetEl.textContent = '🏁';
                        targetEl.style.cursor = 'default';
                        timerEl.innerHTML = 'Игра окончена! Счёт: <b>' + score + '</b>';
                    }
                }, 1000);
            <\/script>
        </body></html>`;
    }

    return { build };
})();