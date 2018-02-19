import { BaseEmitter } from 'kuker-emitters'
const emit = BaseEmitter()

// emit several actions, Kuker extension will show them
console.log('emit first event')
emit({
  type: 'adding money to my account',
  label: 'deposit',
  state: { bank: { money: 100 } },
  icon: 'fa-money',
  color: '#bada55'
})
console.log('emit second event')
emit({
  type: 'removing money',
  label: 'withdrawl',
  state: { bank: { money: 50 } },
  icon: 'fa-money',
  color: '#ffda55'
})
