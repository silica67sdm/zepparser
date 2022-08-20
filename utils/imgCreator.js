function getBubblePng(companyName = "zep") {
    const sharp = require("sharp")
    const fs = require("fs")
    const bumbble = `<svg width="128" height="96" viewBox="0 0 128 96" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x = "2.5" y = "2.5" width = "123" height = "84.7049" rx = "18.5" fill = "white" stroke = "#565656" stroke-width="5" /><path d="M66.41 89.2377L63.777 93.2608L61.144 89.2377L66.41 89.2377Z" fill="#565656" stroke="#565656" stroke-width="3"/><text x="13" y="40" fill="black" font-size="smaller">Hello, Wecolme to</text><text x="55" y="60" fill="black" font-size="smaller">${companyName}</text></svg >`
    fs.writeFile(`./${companyName}.svg`, bumbble, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    })

    sharp(`./${companyName}.svg`)
        .png()
        .toFile(`./${companyName}.png`)
        .then(function (info) {
            console.log(info)
        })
        .catch(function (err) {
            console.log(err)
        })
}

getBubblePng("Amazon")