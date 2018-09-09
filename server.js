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

// app.get('/fuse', async (req, res) => {
// 	const list = await lazy.readFile('./contacts.txt').lines().toArray()
// 	const options = {
// 		includeMatches: true,
// 		threshold: 0.6,
// 		location: 0,
// 		distance: 100,
// 		maxPatternLength: 32,
// 		minMatchCharLength: 1,
// 		keys: undefined
// 	}
// 	const phoneNumber = '+48-421-674-8974'

// 	const fuse = new Fuse(list, options); // "list" is the item array
// 	const result = fuse.search(phoneNumber)
// 	const matches = lazy(result).pluck('matches').toArray()

//     const contactList = lazy(matches).map(item => {
//     	const record = lazy(item).first().value
//     	console.log(record)
//     	const name = record.match(/\<(.*)\>/)
//     	return `Phone: ${phoneNumber}, Name: ${lazy(name).get(1)}`
//     })
// 	res.send(lazy(contactList).toArray())
// })

app.listen(1900, () => {
	console.log('CodeWars Challenge is live on 1900')
});