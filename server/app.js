const retrieval = require('./app/retrieval');

const option = process.argv[2];

(async () => {
    try {
        switch (option) {
            case '1':
                await retrieval.retrieval();
                break;
            case '2':
                console.log('not implemented yet');
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(e);
    } finally {
        process.exit();
    }
})();
