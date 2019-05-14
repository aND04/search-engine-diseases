const retrieval = require('./app/retrieval');
const annotation = require('./app/annotation');

const option = process.argv[2];

(async () => {
    try {
        switch (option) {
            case '1':
                await retrieval.retrieval();
                break;
            case '2':
                await annotation.annotation();
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
