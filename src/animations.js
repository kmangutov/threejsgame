function startWalkingAnimation(player) {
    new TWEEN.Tween(player.arms.left.rotation)
        .to({ x: Math.PI / 4 }, 200) // Arm goes up
        .repeat(Infinity)
        .yoyo(true)
        .start();
    
    new TWEEN.Tween(player.arms.right.rotation)
        .to({ x: -Math.PI / 4 }, 200) // Arm goes down
        .repeat(Infinity)
        .yoyo(true)
        .start();
}

function startIdleAnimation(player) {
    new TWEEN.Tween(player.group.scale)
        .to({ y: 1.05 }, 1000)  // Breathing animation (increasing and decreasing the height)
        .repeat(Infinity)
        .yoyo(true)
        .start();
}
