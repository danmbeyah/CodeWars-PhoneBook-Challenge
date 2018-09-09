const express = require('express')
const app = express()
const lazy = require('lazy.js')
const Fuse = require('fuse.js')

const phoneNumber = '+1-541-914-3010' 
const options = {
	includeMatches: true,
	threshold: 0.5,
	location: 0,
	distance: 100,
	maxPatternLength: 16,
	minMatchCharLength: 3,
	keys: undefined
}

app.get('/fuse', async (req, res) => {
	const fuse = new Fuse(await lazy.readFile('./contacts.txt').lines().toArray(), options)
	const matches = lazy(fuse.search(phoneNumber)).pluck('matches').toArray()
	res.send(lazy(matches).map(item => {
		const record = lazy(item).first().value
		const name = record.match(/\<(.*)\>/)
		const phone = `+${lazy((lazy(record.match(/\+(.*)/)).get(1)).split(/\b(\s)/)).get(0).substring(0,14)}`
		const address = ((record.replace(lazy(name).get(0),'')).replace(phone,'')).replace(/[^\w\s]/gi, '')
		return `Phone: ${phone}, Name: ${lazy(name).get(1)} Address: ${address}`
	}).toArray())
})

app.listen(9000, () => {
	console.log('CodeWars Challenge is live on 9000')
});
