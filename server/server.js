import express from "express"
import mng from "mongoose"
import bodyParser from "body-parser"
import cors from 'cors'

const Schema = mng.Schema

const accSchema = new Schema({
    id: Number,
    username: String,
    balance: Number
})

const Account = mng.model('Account', accSchema)

async function db_connect() {
    try {
        await mng.connect('mongodb://localhost:27017/balance_db')
    } catch (err) { console.error(err) }
    console.log('Соединение с базой установлено')
}

async function db_prepare() {
    let rez = await Account.find()
    if (rez.length == 0) {
        Account.insertMany([
            { id: 1001, username: 'userA', balance: 100 },
            { id: 1002, username: 'userB', balance: 13854 },
            { id: 1003, username: 'useCA', balance: -1024 }
        ])
            .then(() => console.log('База данных подготовлена'))
            .catch(error => console.error(error))
    }
}

async function db_getbalance(id) {
    let rez = await Account.findOne({ id }, 'balance')
    if (rez !== null) return rez
    else return {}
}

async function db_chngbalance(id, method, value) {
    let rez = await db_getbalance(id)
    if ('balance' in rez) {
        switch (method) {
            case 'inc': {
                rez.balance += value
                await rez.save()
                return true
            }
            case 'dec': {
                if ((rez.balance - value) >= -10000) {
                    rez.balance -= value
                    await rez.save()
                    return true
                } else return false
            }
        }
    }
    return false
}

await db_connect()
await db_prepare()

const app = new express()
app.use(cors()).use(bodyParser.json())

app.get('/acc/:id', async (req, res) => {
    res.json({ data: await db_getbalance(req.params.id) })
})

app.post('/acc/:id', async (req, res) => {
    let rez = await db_chngbalance(req.params.id, req.body.method, Number(req.body.value))
    if (rez) res.json({ state: 'success' })
    else res.json({ state: 'fail' })
})

app.listen(5000, console.log('Сервер запущен'))


process.once('SIGINT', () => { mng.disconnect(); console.log('Сервер остановлен') })
process.once('SIGTERM', () => { mng.disconnect(); console.log('Сервер остановлен') })