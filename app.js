const express = require('express')
const app = express()
const routes = require('./routes/route')
const cron = require('node-cron')
const axios = require('axios')
const cheerio = require('cheerio')
const pretty = require('pretty')
const cors = require('cors')
var Sequelize = require('sequelize-cockroachdb')

require('dotenv').config()

app.use(cors())
app.use('/', routes)

const PORT = process.env.PORT || 3000

if (process.env.ADDR === undefined) {
  throw new Error("ADDR (database URL) must be specified.");
}

var sequelize = new Sequelize(process.env.ADDR);
console.log(sequelize)
const Answer = sequelize.define("answer", {
  answer: {
    type: Sequelize.STRING,
  },
  haschosen: {
    type: Sequelize.BOOLEAN,
  },
},
{
  timestamps: false,
})

app.listen(PORT, () => {
  console.log("Listening to port: " + PORT)
})

const indices = "QWER";
//Get new word + clues
cron.schedule('* * * * *', async () => {

  const testGetAll = await Answer.findAll({
    attributes: ['answer'],
    where: {
      haschosen: false
    },
    raw: true
  })

  let answerList = testGetAll.map(entry => entry.answer)

  answer = answerList[Math.floor(Math.random()*answerList.length)]

  console.log(answer)

  const getWholeList = await Answer.findAll({
    raw: true
  })

  let wholeList = getWholeList.map(entry => entry.answer)

  let bundledData = {}

  console.log(!isNaN(answer))
  if (answer.includes("_")) {
    const champion = answer.split("_")[0];
    const ability = indices.indexOf(answer.split("_")[1])

    const testData = await axios.get("http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion/" + champion + ".json")
    const abilityData = testData.data["data"][champion]["spells"][ability];
    const abilityDescription = abilityData.description.replaceAll(champion, "The Champion")

    bundledData["category"] = "Champion Ultimate"
    bundledData["answer"] = champion + " " + answer.split("_")[1]
    bundledData["clues"] = [abilityData.name, abilityData["image"]["full"], abilityDescription]
    bundledData["choices"] = wholeList.filter(entry => entry.includes("_")).map(entry => entry.replace("_", " "))
  }
  else if (!isNaN(answer)){

    const testData = await axios.get("http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/item.json")
    const itemData = testData.data["data"][answer]

    let itemStats = "Gold:" + itemData["gold"]["total"] + " " + JSON.stringify(itemData.stats)
    itemStats = itemStats.replace("FlatArmorMod", "Armor")
    itemStats = itemStats.replace("FlatSpellBlockMod", "MR")
    itemStats = itemStats.replace("FlatHPPoolMod", "Health")
    itemStats = itemStats.replace("FlatMPPoolMod", "Mana")
    itemStats = itemStats.replace("FlatMagicDamageMod", "Magic Damage")
    itemStats = itemStats.replace("FlatPhysicalDamageMod", "Attack Damage")
    itemStats = itemStats.replace("FlatCritChanceMod", "Crit Chance")
    itemStats = itemStats.replace("PercentLifeStealMod", "Life Steal")
    itemStats = itemStats.replace("PercentAttackSpeedMod", "Attack Speed")
    itemStats = itemStats.replace(/[{}\,"]/g, "")

    let buildPath = "";
    for (let item in itemData["from"]) {
      buildPath += testData.data["data"][itemData["from"][item]]["name"] + " "
    }

    let itemDescription = itemData["description"].replace( /(<([^>]+)>)/ig, '')

    bundledData["category"] = "Item"
    bundledData["answer"] = itemData["name"]
    bundledData["clues"] = [itemStats, buildPath, itemDescription]
    bundledData["choices"] = wholeList.filter(entry => !isNaN(entry)).map(entry => testData.data["data"][entry]["name"])
    console.log(bundledData["choices"])
  }
  else {
    const champion = answer;

    const testData = await axios.get("http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion/" + champion + ".json")
    const championData = testData.data["data"][champion];

    const scrapeHTML = await axios.get("https://leagueoflegends.fandom.com/wiki/" + champion + "/LoL")
    const $ = cheerio.load(scrapeHTML.data)
    let trivia = $("#Trivia").parent().nextAll("ul:first").find("li:first").clone()	//clone the element
                                                                          	  .children("ul")	//select all the children
                                                                          		.remove()	//remove all the children
                                                                          		.end()	//again go back to selected element
                                                                          		.text();
    trivia = trivia.replaceAll(champion, "The Champion")
    bundledData["category"] = "Champion"
    bundledData["answer"] = champion
    bundledData["clues"] = [trivia, "Passive: " + championData["passive"]["name"], championData["title"]]
    bundledData["choices"] = wholeList.filter(entry => (isNaN(entry) && !entry.includes("_")))
  }

  console.log(bundledData["choices"])

  const updateDB = Answer.update(
    {
      haschosen: true,
    },
    {
      where: {answer: answer},
      returning: true
    }
  )
  module.exports = bundledData;
})
