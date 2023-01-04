kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0,0,0,1]
})
 const MOVE_SPEED = 120;
 const ENEMY_SPEED = 60;

//carregando as prites do jogo

loadRoot('https://i.imgur.com/');

loadSprite('tronco', 'IeRXSst.png'); 
loadSprite('pc', 'iIEHSRU.png');
loadSprite('portal', 'E0Pbwna.png');
loadSprite('kaboom', 'o9WizfI.png');
loadSprite('bg', 'AZBrxGQ.png');
loadSprite('mato', 'wmZb9Fs.png');
loadSprite('celular', 'HNCqSud.png');

//carregando e animando o curupira

loadSprite('curupira', 'Ayqv8At.png', {
  sliceX: 7,
  sliceY: 4,
  anims: {
    //parado
    idleLeft: { from: 21, to: 21 },
    idleRight: { from: 7, to: 7 },
    idleUp: { from: 0, to: 0 },
    idleDown: { from: 14, to: 14 },

    //mexendo
    moveLeft: { from: 22 , to: 27  },
    moveRigth: { from: 8, to: 13 },
    moveUp: { from: 1, to: 6 },
    moveDown: { from: 15, to: 20 },    
  }
});
  //magia, unica que animei legal
loadSprite('magia', 'BKUfwmv.png', {
  sliceX: 3,

  anims: {
    move: { from: 0, to: 2 },
  }
})
    //carregando os monstros
loadSprite('monstro1', 'w73IQaf.png', { sliceX: 3 })

loadSprite('monstro2', '99Dcdfe.png', { sliceX: 3 })

loadSprite('monstro3', 'VQsF0ro.png', { sliceX: 3 })

loadSprite('explosao', 'eE68nCQ.png', { 
  sliceX: 5,
  sliceY: 5,
})


scene('game', ({level, score}) => {
  layers(['bg', 'obj', 'ui'], 'obj');

  const maps = [
    [
      'aaaaaaaaaaaaaaa',
      'azzzz  *zzzzzda',
      'azazazazazazaza',
      'azzzzzzzzzzzzza',
      'azazazazazaza a',
      'azzzz* zzzzzz}a',
      'azazazazazaza a',    //mapa1
      'a zzzzzzzzzzz a',
      'a azazazazazaza',
      'a  zzzdzzzzzzza',
      'a azazazazazaza',
      'azzzzzzzzzzzzza',
      'azazazazazazaza',
      'azzzzz   &   za',
      'aaaaaaaaaaaaaaa',
    ],
    [
      'bbbbbbbbbbbbbbb',
      'bwwww  *wwwwwpb',
      'bwbwbwbwbwbwbwb',
      'b      *      b',
      'bwbwbwbwbwbwb b',
      'bwwww* wwwwwwwb',   //mapa2
      'bwbwbwbwb bwb b',
      'b wwwpwww}www b',
      'b bwbwbwb bwbwb',
      'b  wwwwwwwwwwwb',
      'b bwbwbwbwbwbwb',
      'bwww  &   wwwwb',
      'bwbwbwbwbwbwbwb',
      'bwwwww   &   wb',
      'bbbbbbbbbbbbbbb',
    ]
  ]

  const levelCfg = {
    width: 26,
    height: 26,
    a: [sprite('tronco'), 'tronco', solid(), 'wall'],
    z: [sprite('pc'), 'wall-brick', solid(), 'wall'],
    d: [sprite('pc'), 'wall-brick-dool', solid(), 'wall'],
    b: [sprite('mato'), 'mato', solid(), 'wall'],
    w: [sprite('celular'), 'wall-brick', solid(), 'wall'],
    p: [sprite('celular'), 'wall-brick-dool', solid(), 'wall'],
    t: [sprite('portal'), 'portal', 'wall'],    
    '}': [sprite('monstro2'), 'dangerous', 'monstro2', { dir: -1, timer: 0 }],
    '&': [sprite('monstro3'), 'monstro3', { dir: -1 }, 'dangerous', { timer: 0 }],    
    '*': [sprite('monstro1'), 'monstro1', { dir: -1 }, 'dangerous', { timer: 0 }],
  }

  const gameLevel = addLevel(maps[level], levelCfg);

  add([sprite('bg'), layer('bg')])

   //pontos e niveis
  const scoreLabel = add([
    text('Pontos: ' + score),
    pos(400, 30),
    layer('ui'),
    {
      value: score,
    },
    scale(1)
  ])

  add([text('Nivel: ' + parseInt(level + 1)), pos(400, 60), scale(1)])

  const player = add([
    sprite('curupira', {
      animeSpeed: 0.1,
      frame: 14,
    }),
    pos(20,190),
    { dir: vec2(1,0) },
  ])

  //ações do curupira
  player.action(() => {
    player.pushOutAll()
  })

  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0);
    player.dir = vec2(-1, 0);
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0);
    player.dir = vec2(1, 0);
  })

  keyDown('up', () => {
    player.move(0, -MOVE_SPEED);
    player.dir = vec2(0, -1);
  })  

  keyDown('down', () => {
    player.move(0, MOVE_SPEED);
    player.dir = vec2(0, 1);
  })   

  keyPress('left', () => {
    player.play('moveLeft')
  })

  keyPress('right', () => {
    player.play('moveRigth')
  })

  keyPress('up', () => {
    player.play('moveUp')
  })  

  keyPress('down', () => {
    player.play('moveDown')
  }) 
  
  keyRelease('left', () => {
    player.play('idleLeft')
  })

  keyRelease('right', () => {
    player.play('idleRight')
  })
  
  keyRelease('up', () => {
    player.play('idleUp')
  })

  keyRelease('down', () => {
    player.play('idleDown')
  })
      //botar a magia
  keyPress('space', () => {
    spawnBomber(player.pos.add(player.dir.scale(0)))
  })

  //ações dos monstros
  action('monstro1', (s) => {
    s.pushOutAll();
    s.move(s.dir * ENEMY_SPEED, 0)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  })

  action('monstro3', (s) => {
    s.pushOutAll();
    s.move(s.dir * ENEMY_SPEED, 0)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  })  

  action('monstro2', (s) => {
    s.pushOutAll();
    s.move(0 , s.dir * ENEMY_SPEED)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  }) 
  
  //funções

  function spawnKaboom(p, frame){
    const obj = add([
      sprite('explosao', {
        animeSpeed: 0.1,
        frame: frame,
      }),
      pos(p),
      scale(1.5),
      'kaboom'
    ])

    obj.pushOutAll();
    wait(0.5, () => {
      destroy(obj);
    })
  }

  function spawnBomber(p){
    const obj = add([sprite('magia'), ('move'), pos(p), scale(1.5), 'bomber']);
    obj.pushOutAll();
    obj.play("move");

    wait(4, () => {
      destroy(obj);

      obj.dir = vec2(1,0)
      spawnKaboom(obj.pos.add(obj.dir.scale(0)), 12) // center

      obj.dir = vec2(0, -1)
      spawnKaboom(obj.pos.add(obj.dir.scale(20)), 2) // up

      
      obj.dir = vec2(0, 1)
      spawnKaboom(obj.pos.add(obj.dir.scale(20)), 22) // down

      
      obj.dir = vec2(-1, 0)
      spawnKaboom(obj.pos.add(obj.dir.scale(20)), 10) // left

      obj.dir = vec2(1, 0)
      spawnKaboom(obj.pos.add(obj.dir.scale(20)), 14) // rigth

    })
  }

  //config. das colisões

  player.collides('portal', (d) => {
    go("game", {
      level: (level + 1) % maps.length,
      score: scoreLabel.value
    })
  })

  collides('kaboom', 'dangerous', (k,s) => {
    camShake(4);
     wait(1, () => {
       destroy(k)
     })
     destroy(s);
     scoreLabel.value++
     scoreLabel.text = 'Score: ' + scoreLabel.value
  })


  collides('kaboom', 'wall-brick', (k,s) => {
    camShake(4);
     wait(1, () => {
       destroy(k)
     })
     destroy(s);
  })

  collides('monstro1', 'wall', (s) => {
    s.dir = -s.dir;
  })

  collides('monstro3', 'wall', (s) => {
    s.dir = -s.dir;
  })

  collides('monstro2', 'wall', (s) => {
    s.dir = -s.dir;
  })

  collides('kaboom', 'wall-brick-dool', (k,s) => {
    camShake(4);
    wait(1, () => {
      destroy(k);
    })
    destroy(s);
    gameLevel.spawn('t', s.gridPos.sub(0,0))
  })
  
  player.collides('dangerous', () => {
    go('lose', {score: scoreLabel.value})
  })
})

scene('lose', ( { score } ) => {
  add([text('Pontos: '+ score, 32), origin('center'), pos(width() / 2, height() / 2)])

  keyPress('space', () => {
    go('game', { level: 0, score: 0 });
  })
})

go('game', { level: 0, score: 0 });