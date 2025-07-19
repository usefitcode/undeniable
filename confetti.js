// Confetti Party
document.addEventListener("DOMContentLoaded", function() {
    const confettiElems = document.querySelectorAll("[ms-code-confetti]");

    confettiElems.forEach(item => {
        item.addEventListener("click", () => {
            const effect = item.getAttribute("ms-code-confetti");
            switch (effect) {
                case "falling":
                    const makeFall = () => {
                        confetti({
                            particleCount: 100,
                            startVelocity: 30,
                            spread: 360,
                            origin: { x: Math.random(), y: 0 },
                            colors: ['#ffffff','#ff0000','#00ff00','#0000ff']
                        });
                    }
                    setInterval(makeFall, 2000);
                    break;
                case "single":
                    confetti({
                        particleCount: 1,
                        startVelocity: 30,
                        spread: 360,
                        origin: { x: Math.random(), y: Math.random() }
                    });
                    break;
                case "sides":
                    confetti({
                        particleCount: 100,
                        startVelocity: 30,
                        spread: 360,
                        origin: { x: Math.random(), y: 0.5 }
                    });
                    break;
                case "explosions":
                    confetti({
                        particleCount: 100,
                        startVelocity: 50,
                        spread: 360
                    });
                    break;
                case "bottom":
                    confetti({
                        particleCount: 100,
                        startVelocity: 30,
                        spread: 360,
                        origin: { x: 0.5, y: 1 }
                    });
                    break;
                default:
                    console.log("Unknown confetti effect");
            }
        });
    });
}); 