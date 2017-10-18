import RegisterComponents from './RegisterComponents'
import RegisterFactory from './RegisterFactory'

export default function(mainCanvas, renderer) {
    var register = new RegisterFactory(mainCanvas);

    for (let x of RegisterComponents) {
        var current = require('./' + x);
        current.default(register.register, renderer);
    }

    return register.componentInterface;
}
