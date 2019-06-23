import React from "react"
import ReactDOM from 'react-dom'
import App from './App'

function initApp () {
	let root = document.createElement('div')
	root.id = 'root'
	document.body.appendChild(root)
	ReactDOM.render(<App />, document.getElementById('root'))
}

initApp()