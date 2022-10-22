let axios = require('axios')

it('Making GET', async () => {
    let res = await axios.get('http://localhost:5000/acc/1001')
    expect(res.status).toBe(200)
})

it('Making POST', async () => {
    let res = await axios.post('http://localhost:5000/acc/1001')
    expect(res.status).toBe(200)
})

it('Making inc', async () => {
    let res = await axios.post('http://localhost:5000/acc/1001', { method: 'inc', value: 10 })
    expect(res.data.state).toBe('success')
})

it('Not less than -10000', async () => {
    let res1 = await axios.get('http://localhost:5000/acc/1001')
    let res2 = await axios.post('http://localhost:5000/acc/1001', { method: 'dec', value: res1.data.data.balance + 10001 })
    expect(res2.data.state).toBe('fail')
    let res3 = await axios.get('http://localhost:5000/acc/1001')
    expect(res3.data.data.balance).toBe(res1.data.data.balance)
})

function getRnd(max) {
    return Math.floor(Math.random() * max)
}
it('Answering on querry', async () => {
    for (let i = 0; i <= 10; i++) {
        let res = await axios.post('http://localhost:5000/acc/1001', { method: (getRnd(2) == 0) ? 'inc' : 'dec', value: getRnd(20) * 100 })
        expect(res.data.state).toBe('success')
    }
})