function s_gen() {
    // console.log(arguments.callee);
    // Not supported
    // console.log(arguments.callee.caller.toString());
    var curr = arguments.callee;
    console.log(curr.caller);

    // callee is function itself
    var curr = arguments.callee;
    // console.log(curr['arguments']);
    // convert it to string
    // console.log(curr.toString());

    var reg = /function(?:\s+([\w$]+))+\s*\(/;

    // is function declaration
    // console.log(reg.test(curr.toString()));

    // end condition?
    
    while (curr && curr.caller) {
        curr = curr.caller;
        try {
            curr();
        } catch(e) {
            console.error(e);
        }
        curr = curr.callee;        
    }

    try {
        curr = curr.caller;
        // Maximum call stack error
        // curr(arguments);
    } catch(e) {
        console.error(e);  
    }
}

function exec() {
    (function someFunc() {
        s_gen(1);
    })();
}

exec();
