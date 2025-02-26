function startWalkingAnimation(player) {
    new TWEEN.Tween(player.arms.left.rotation)
        .to({ x: 0.5 }, 200)
        .repeat(Infinity)
        .yoyo(true)
        .start();
    
    new TWEEN.Tween(player.arms.right.rotation)
        .to({ x: -0.5 }, 200)
        .repeat(Infinity)
        .yoyo(true)
        .start();
}

function startIdleAnimation(player) {
    new TWEEN.Tween(player.group.scale)
        .to({ y: 1.05 }, 1000)
        .repeat(Infinity)
        .yoyo(true)
        .start();
}
