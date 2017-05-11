import Game from './game'

var game = new Game({
	foodCount: 10,
	speed: 5,
	graphSize: 600,
	rectSize: 8
})
game.start()

actions.addEventListener('click', function(e){
	var role
	if( role = e.target.dataset.role){
		switch(role){
			case 'speedup' : game.adjustSpeed(1);break;
			case 'speeddown' : game.adjustSpeed(-1);break;
			case 'restart' : game.restart();break;
		}
	}
})