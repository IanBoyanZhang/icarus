function s_gen() {
    console.trace();   
/*    try {
        undefined();
    } catch(e) {
//        console.log(e.stack);
//        processor(e);
    }
    */
}

function processor(err) {
// TODO: optimize engine super fast
// regex it?
    var res = err.stack.split("\n");
    for (var i = 1, len = res.length; i < len; i+=1) {
        // first line error type
         
        console.log(res[i].split("at"));
    }
}

function trace() {
    console.trace();
}

function exec() {
    s_gen(1);
}

exec();

