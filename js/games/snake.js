window.GameSnake = (function() {
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
        const cell = isGrandma ? 30 : isKids ? 24 : 20;
        const boardSize = isGrandma ? 20 : isKids ? 22 : 24;

        return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
            body{margin:0;background:${palette.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:${palette.text};user-select:none;}
            h2{margin:0 0 8px;font-size:${font};}
            .hud{margin-bottom:10px;font-size:${isGrandma ? '22px' : '16px'};font-weight:bold;}
            canvas{background:#fff;border:${isGrandma ? '4px' : '2px'} solid ${palette.fg};border-radius:${isGrandma ? '12px' : '6px'};}
            .controls{margin-top:12px;display:grid;grid-template-columns:repeat(3,${isGrandma ? '70px' : '50px'});gap:6px;}
            .controls button{background:${palette.accent};color:#fff;border:none;padding:${isGrandma ? '18px' : '12px'};border-radius:8px;font-size:${isGrandma ? '24px' : '18px'};cursor:pointer;font-weight:bold;}
            .controls button:active{opacity:0.7;}
            .empty{visibility:hidden;}
        </style></head><body>
            <h2>${palette.title} — Змейка</h2>
            <div class="hud">Счёт: <span id="score">0</span></div>
            <canvas id="c" width="${boardSize * cell}" height="${boardSize * cell}"></canvas>
            <div class="controls">
                <button class="empty"></button>
                <button onclick="setDir(0,-1)">▲</button>
                <button class="empty"></button>
                <button onclick="setDir(-1,0)">◀</button>
                <button onclick="setDir(0,1)">▼</button>
                <button onclick="setDir(1,0)">▶</button>
            </div>
            <script>
                const PALETTE = ${JSON.stringify(palette)};
                const CELL = ${cell};
                const BOARD = ${boardSize};
                const DIFF = ${diff};
                const ctx = document.getElementById('c').getContext('2d');
                const scoreEl = document.getElementById('score');
                let snake, food, dx, dy, score, timer, over;
                const baseSpeed = ${isGrandma ? 220 : isKids ? 160 : 130} - DIFF * 25;

                function reset(){
                    snake = [{x:10,y:10}];
                    dx = 1; dy = 0; score = 0; over = false;
                    scoreEl.textContent = 0;
                    placeFood();
                    clearInterval(timer);
                    timer = setInterval(step, baseSpeed);
                    document.onkeydown = e => {
                        if(e.key==='ArrowUp') setDir(0,-1);
                        if(e.key==='ArrowDown') setDir(0,1);
                        if(e.key==='ArrowLeft') setDir(-1,0);
                        if(e.key==='ArrowRight') setDir(1,0);
                    };
                    draw();
                }
                function setDir(nx,ny){
                    if(over) return;
                    if(nx === -dx && ny === -dy) return;
                    dx = nx; dy = ny;
                }
                function placeFood(){
                    let f;
                    do { f = {x:Math.floor(Math.random()*BOARD), y:Math.floor(Math.random()*BOARD)}; }
                    while(snake.some(s => s.x===f.x && s.y===f.y));
                    food = f;
                }
                function step(){
                    const head = {x:snake[0].x+dx, y:snake[0].y+dy};
                    if(head.x<0||head.x>=BOARD||head.y<0||head.y>=BOARD||snake.some(s=>s.x===head.x&&s.y===head.y)){
                        over = true;
                        clearInterval(timer);
                        ctx.fillStyle = 'rgba(0,0,0,0.7)';
                        ctx.fillRect(0,0,${boardSize * cell},${boardSize * cell});
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold ${isGrandma ? '24px' : '20px'} sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('Игра окончена!', ${boardSize * cell}/2, ${boardSize * cell}/2 - 15);
                        ctx.fillText('Счёт: ' + score, ${boardSize * cell}/2, ${boardSize * cell}/2 + 20);
                        setTimeout(reset, 2000);
                        return;
                    }
                    snake.unshift(head);
                    if(head.x === food.x && head.y === food.y){
                        score++;
                        scoreEl.textContent = score;
                        placeFood();
                    } else snake.pop();
                    draw();
                }
                function draw(){
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0,0,${boardSize * cell},${boardSize * cell});
                    ctx.fillStyle = PALETTE.accent;
                    snake.forEach(s => {
                        ctx.fillRect(s.x*CELL+1, s.y*CELL+1, CELL-2, CELL-2);
                    });
                    ctx.fillStyle = PALETTE.fg;
                    ctx.beginPath();
                    ctx.arc(food.x*CELL+CELL/2, food.y*CELL+CELL/2, CELL/2-2, 0, Math.PI*2);
                    ctx.fill();
                }
                reset();
            <\/script>
        </body></html>`;
    }

    return { build };
})();