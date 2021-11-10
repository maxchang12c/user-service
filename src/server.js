const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const router = express.Router();
const { isUndefinedNullOrEmpty } = require('./utils/index.js')
const { startDatabase } = require('./database.js');
const { getCustomerList, getCustomer, updateCustomer, insertCustomer, deleteCustomer } = require('./user/methods.js');


const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));


app.get('/user/list', async (req, res) => {
    try {
        const customerList = await getCustomerList();
        res.send(customerList);
    }
    catch (e) {
        response.send({ ret: '999', msg: `error ${err}` })
    }
});

app.get('/user', async (req, res) => {
    try {
        if (!isUndefinedNullOrEmpty(req.query)) {
            const customer = await getCustomer({ ...req.query });
            res.send({ ret: '0', data: customer });
        }
    }
    catch (e) {
        res.send({ ret: '999', msg: `error ${e}` })
    }
});

router.post('/add', async (request, response) => {
    try {
        if (!isUndefinedNullOrEmpty(request.body)) {
            const id = await insertCustomer({ ...request.body })
            if (id) {
                response.send({ ret: '0' })
            } else {
                response.send({ ret: '99', msg: `id ${id}` })
            }
        }
    } catch (err) {
        response.send({ ret: '999', msg: `error ${err}` })
    }

});

router.post('/delete', async (request, response) => {
    try {
        if (!isUndefinedNullOrEmpty(request.body)) {
            const msg = await deleteCustomer({ ...request.body })
            if (msg) {
                response.send({ ret: '0', msg: msg })
            } else {
                response.send({ ret: '99', msg: `id ${msg}` })
            }
        }
    } catch (err) {
        response.send({ ret: '999', msg: `error ${err}` })
    }

});

router.post('/update', async (request, response) => {
    try {
        if (!isUndefinedNullOrEmpty(request.body)) {
            const msg = await updateCustomer({ ...request.body })
            if (msg) {
                response.send({ ret: '0', msg: msg })
            } else {
                response.send({ ret: '99', msg: `id ${msg}` })
            }
        }
    } catch (err) {
        response.send({ ret: '999', msg: `error ${err}` })
    }

});


// add router in the Express app.
app.use("/", router);

startDatabase().then(async () => {
    app.listen(3020, async () => {
        console.log('listening on port 3001');
    });
});
