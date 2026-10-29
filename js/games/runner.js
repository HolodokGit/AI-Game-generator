window.GameRunner = (function() {
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

        return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
            body{margin:0;background:${palette.bg};overflow:hidden;font-family:sans-serif;color:${palette.text};user-select:none;}
            #hud{position:absolute;top:12px;left:12px;font-size:${isGrandma ? '20px' : '16px'};font-weight:bold;background:rgba(255,255,255,0.8);padding:6px 12px;border-radius:8px;color:${palette.text};}
            #over{position:absolute;inset:0;background:rgba(0,0,0,0.75);display:none;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-size:${isGrandma ? '28px' : '22px'};gap:16px;}
            #over button{background:${palette.accent};color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:${isGrandma ? '22px' : '18px'};cursor:pointer;font-weight:bold;}
        </style></head><body>
            <div id="hud">Счёт: <span id="score">0</span> · Время: <span id="time">30</span>с</div>
            <div id="over"><div>Игра окончена!</div><div>Ваш счёт: <b id="finalScore">0</b></div><button onclick="reset()">Играть снова</button></div>
            <canvas id="c"></canvas>
            <script>
                const PALETTE = ${JSON.stringify(palette)};
                const DIFF = ${diff};
                const canvas = document.getElementById('c');
                const ctx = canvas.getContext('2d');
                const scoreEl = document.getElementById('score');
                const timeEl = document.getElementById('time');
                const overEl = document.getElementById('over');
                const finalScoreEl = document.getElementById('finalScore');
                let player, obstacles, score, timeLeft, over, timer, tick;

                function resize(){
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
                window.addEventListener('resize', resize);
                resize();

                const playerSize = ${isGrandma ? '50' : isKids ? '36' : '30'};
                const baseSpeed = ${isGrandma ? '3' : isKids ? '4' : '5'} + DIFF;
                const spawnRate = ${isGrandma ? '60' : isKids ? '50' : '40'} - DIFF * 8;

                function reset(){
                    player = {x: canvas.width/2, y: canvas.height - 100, size: playerSize};
                    obstacles = []; score = 0; timeLeft = 30; over = false; tick = 0;
                    scoreEl.textContent = 0;
                    timeEl.textContent = 30;
                    overEl.style.display = 'none';
                    if(timer) clearInterval(timer);
                    timer = setInterval(() => {
                        if(over) return;
                        timeLeft--;
                        timeEl.textContent = timeLeft;
                        if(timeLeft <= 0){ endGame(); }
                    }, 1000);
                    requestAnimationFrame(loop);
                }

                function endGame(){
                    over = true;
                    overEl.style.display = 'flex';
                    finalScoreEl.textContent = score;
                }

                document.addEventListener('mousemove', e => { if(player && !over) player.x = e.clientX; });
                document.addEventListener('touchmove', e => {
                    if(player && !over){ player.x = e.touches[0].clientX; e.preventDefault(); }
                }, {passive:false});

                function loop(){
                    if(over) return;
                    tick++;
                    ctx.fillStyle = PALETTE.bg;
                    ctx.fillRect(0,0,canvas.width,canvas.height);

                    if(tick % spawnRate === 0){
                        obstacles.push({
                            x: Math.random() * (canvas.width - 40),
                            y: -40,
                            size: ${isGrandma ? '40' : isKids ? '34' : '30'},
                            speed: baseSpeed + Math.random() * 2
                        });
                    }

                    obstacles.forEach(o => o.y += o.speed);
                    obstacles = obstacles.filter(o => o.y < canvas.height + 50);

                    ctx.fillStyle = PALETTE.fg;
                    obstacles.forEach(o => {
                        ctx.fillRect(o.x, o.y, o.size, o.size);
                    });

                    ctx.fillStyle = PALETTE.accent;
                    ctx.fillRect(player.x - player.size/2, player.y - player.size/2, player.size, player.size);

                    for(const o of obstacles){
                        if(o.x < player.x + player.size/2 && o.x + o.size > player.x - player.size/2 &&
                           o.y < player.y + player.size/2 && o.y + o.size > player.y - player.size/2){
                            endGame();
                            return;
                        }
                    }

                    score++;
                    scoreEl.textContent = Math.floor(score / 6);
                    requestAnimationFrame(loop);
                }

                reset();
            <\/script>
        </body></html>`;
    }

    return { build };
})();