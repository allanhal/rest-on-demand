var debug = false;
this.log = function (message) {
    if (debug)
        return console.log(message)

    return false;
}