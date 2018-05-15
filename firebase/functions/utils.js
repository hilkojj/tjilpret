
module.exports = function() {

    this.refValue = function(reference, callback) {
        reference.once("value", snapshot => {
            callback(snapshot.val());
        });
    }

}
