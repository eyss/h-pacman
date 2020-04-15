import './index.css'

import PACMAN from './pacman'
import holochain from './holochain'

const displayModal = modal => {
  modal.parentNode.style.display = 'block'
}
const hideModal = modal => {
  modal.parentNode.style.display = 'none'
}

let userAddress = null,
  userName = null

const fillScoreTable = array => {
  let tBody = document.getElementById('scores-tbody')
  tBody.innerText = ''
  array.forEach(score => {
    let tr = document.createElement('tr')
    let tdUserName = document.createElement('td')
    let tdScore = document.createElement('td')
    tdUserName.innerText = score.message
    tdScore.innerText = score.score
    tr.appendChild(tdUserName)
    tr.appendChild(tdScore)
    tBody.appendChild(tr)
  })
}
window.addEventListener('DOMContentLoaded', async event => {
  const usernameModal = document.getElementById('username-modal')
  const scoreSelector = document.getElementById('score-selection')
  const loadingModal  = document.getElementById('loading-modal')
  const scoresButton  = document.getElementById('scores-button')
  const scoresModal   = document.getElementById('scores-modal')
  const canvasDiv     = document.getElementById('pacman')

  PACMAN.init(canvasDiv, "./", async points => {
    let res = await holochain.sendScore(points, userName)
    console.log('score sent', res)
  })
  scoresButton.addEventListener('click',  async e => {// display scores
    e.preventDefault()
    e.stopPropagation()
    document.getElementById('score-selection').value = 'mine'
    displayModal(scoresModal)
    let res = await holochain.getAllScores()
    res.Ok = res.Ok.filter(score => score.author_address === userAddress)
    fillScoreTable(res.Ok)
  })
  scoreSelector.addEventListener('change', async e => {
    let res = await holochain.getAllScores()
    if (scoreSelector.value === 'mine') {
      res.Ok = res.Ok.filter(score => score.author_address === userAddress)
    }
    fillScoreTable(res.Ok)
  })
  document.getElementById('close-scores').addEventListener('click', e => {
    e.stopPropagation()
    e.preventDefault()
    hideModal(scoresModal)
    canvasDiv.focus()
  })
  const res = await holochain.isUserCreated()
  loadingModal.style.display = 'none'
  if(res.Err) { // user is not created
    console.log('showing username modal')
    displayModal(usernameModal)
  }else{ //user is already created
    userAddress = res.Ok.address
    userName = res.Ok.name
    canvasDiv.focus()
  }
  document.getElementById('username-button').addEventListener('click', async e => {
    const name = document.getElementById('username-input').value
    if (!name || name.length < 4) {
      alert('your username must hace at least 4 characters')
      return
    }
    const res = await holochain.createProfile(name)
    console.log(res)
    hideModal(usernameModal)
    canvasDiv.focus()
    window.location.reload()
  })
})