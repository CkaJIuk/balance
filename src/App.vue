<template>
  <span>Id пользователя: {{id}}, баланс: {{balance}}</span>
  <div style="margin-top: 20px;">
    <span>Сумма: </span>
    <input type="text" size="20" v-model="text">
  </div>
  <div style="margin-top: 20px;">
    <button @click="inc()">Добавить</button>
  </div>
  <div style="margin-top: 20px;">
    <button @click="dec()">Списать</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      id: 1001,
      text: '',
      balance: 0
    }
  },
  methods: {
    inc() {
      if (this.validate()) {
        axios.post(`http://localhost:5000/acc/${this.id}`,
          {
            method: 'inc',
            value: this.text
          })
          .then((res) => {
            if (res.data.state === 'success') {
              this.updBalance()
              alert('Баланс пользователя увеличен')
            }
            else alert('Произошла ошибка')
          })
      } else alert('Не правильный формат введенных данных!')
    },
    dec() {
      if (this.validate()) {
        axios.post(`http://localhost:5000/acc/${this.id}`,
          {
            method: 'dec',
            value: this.text
          })
          .then((res) => {
            if (res.data.state === 'success') {
              this.updBalance()
              alert('Баланс пользователя уменьшен')
            }
            else alert('Произошла ошибка')
          })
      } else alert('Не правильный формат введенных данных!')
    },
    validate() {
      if (this.text.match(/^\d+$/)) return true
      else return false
    },
    updBalance() {
      axios.get(`http://localhost:5000/acc/${this.id}`)
        .then((res) => {
          this.balance = res.data.data.balance
        })
    }
  },
  mounted() {
    this.updBalance()
  }
}
</script>
