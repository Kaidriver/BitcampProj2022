const express = require('express')
const app = express()
const routes = require('./routes/route')
const cron = require('node-cron')
const axios = require('axios')
const cheerio = require('cheerio')
const pretty = require('pretty')

require('dotenv').config()

app.use('/', routes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Listening to port: " + PORT)
})


var answers = ["Aatrox", "Aatrox&Q","3181", "Illaoi&W", "Lux&R"]
const indices = "QWER";
var currentAnswer = 0
//Get new word + clues
cron.schedule('* * * * *', async () => {
  let answer = answers[currentAnswer]

  let bundledData = {}
  if (answer.includes("&")) {
    const champion = answer.split("&")[0];
    const ability = indices.indexOf(answer.split("&")[1])

    const testData = await axios.get("http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion/" + champion + ".json")
    const abilityData = testData.data["data"][champion]["spells"][ability];
    const abilityDescription = abilityData.description.replaceAll(champion, "The Champion")

    bundledData["category"] = "Champion"
    bundledData["answer"] = answer
    bundledData["clues"] = [abilityData.name, abilityData["image"]["full"], abilityDescription]
  }
  else if (!isNaN(answer)){
    const testData = await axios.get("http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/item.json")
    const itemData = testData.data["data"][answer]

    let itemStats = "Gold:" + itemData["gold"]["base"] + " " + JSON.stringify(itemData.stats)
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
  }

  currentAnswer++;
  console.log(currentAnswer)
  module.exports = bundledData;
})