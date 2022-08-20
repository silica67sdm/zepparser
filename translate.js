var fs = require('fs');

function getJson(content, targetDir) {

    let companyTitle = getCompanyName(content);
    let companyContent = getCompanyContent(content);
    let companyYoutubeLink = getYoutubeLink(companyContent);
    let companyDescription = getDescription(companyContent);
    let companyImg = getCompanyImg(companyContent);

    let productContent = getProductContent(content);
    let productPromotionVideo = getYoutubeLink(productContent);
    let productDescription = getDescription(productContent);
    let productImg = getProductIgmg(productContent);

    let isRecruitment = content.includes('## Recruitment');
    let recruitmentJds = [];
    let recruitmentContact = "";
    if (isRecruitment) {
        recruimentContent = getRecruitmentContent(content);
        recruitmentJds = getRecruitmentJds(recruimentContent);
        recruitmentContact = getRecruitmentContact(recruimentContent);
    }
    let youtubeThumbnailLink = getYoutubeThumbnail(companyYoutubeLink);
    let defaultDir = targetDir + '/' + companyImg[0].split('/')[0].replace("%20", " ");
    downloadImgFile(youtubeThumbnailLink, defaultDir + '/thumbnail.png');

    let logoPath = getCompanyLogo(content);

    const json_result = {
        "companyName": companyTitle,
        "companyYoutubeLink": companyYoutubeLink,
        "companyDescription": companyDescription,
        "product": {
            "promotionVideo": productPromotionVideo,
            "description": productDescription,
            "images": productImg
        },
        "recruitment": {
            "jds": recruitmentJds,
            "isRecruimentOngoing": isRecruitment,
            "managerContact": recruitmentContact
        },
        "images": companyImg,
        "logoPath": logoPath,
        "youtubeThumbnailPath": companyImg[0].split('/')[0] + '/thumbnail.png',
    }
    return JSON.stringify(json_result);
}

function getCompanyName(content) {
    const regex = /(?<=^# )[a-zA-Z]+/gm;
    let match = regex.exec(content);
    return match[0];
}

function getYoutubeLink(content) {
    const regex = /(https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9]+)/gm;
    let match = regex.exec(content);
    return match[0];
}

function getCompanyContent(content) {
    const regex = /(?<=^# )(.*?)(?=## )/gms;
    let match = regex.exec(content);
    return match[0];
}

function getDescription(content) {
    const regex = /\[(https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9]+)]\((https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9]+)\)/gms;
    const subst = ``;
    let result = content.replace(regex, subst);
    result = result.replace('### ', '');
    const regex2 = /!\[(.*?)\]\((.*?)\)/gms;
    const subst2 = ``;
    result = result.replace(regex2, subst2);
    result = result.replace("### Product Image", "");
    return result;
}

function getProductContent(content) {
    const regex = /(?<=^## Product)(.*?)(?=## Recruitment)/gms;
    let match = regex.exec(content);
    return match[0];
}


function getProductIgmg(content) {
    const regex = /!\[(.*?)\]\((.*?)\)/gms;

    let result = []
    let m;

    while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex == 2) {
                result.push(match);
            }
        });
    }
    return result;
}


function getIsRecruitment(content) {
    const regex = /(?<=^## Product)(.*?)(?=## Recruitment)/gms;
    let match = regex.exec(content);
    return match != null;
}

function getRecruitmentJds(content) {
    const regex = /(?<=\| Title \| Link \|\n\| --- \| --- \|\n).*$/gms;
    let match = regex.exec(content);
    content = match[0];
    let parse_result = content.split('\n').map(line => {
        line = line.trim();
        if (!line) return '';
        if (!line.startsWith('|')) line = `|${line}`;
        if (!line.endsWith('|')) line = `${line}|`;

        return line.split('|').slice(1, -1);
    });
    console.log(parse_result);
    let result = parse_result.map(line => {
        return {
            "title": line[0].trim(),
            "link": line[1].trim()
        }
    })
    return result;
}

function getRecruitmentContent(content) {
    const regex = /(?<=## Recruitment).*$/gms;
    let match = regex.exec(content);
    return match[0];
}

function getRecruitmentContact(content) {
    const regex = /(?<=Contact : ).*$/gm;
    let match = regex.exec(content);
    return match[0];
}

function getCompanyImg(content) {
    const regex = /!\[(.*?)\]\((.*?)\)/gms;

    let result = []
    let m;

    while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex == 2) {
                result.push(match);
            }
        });
    }
    return result;

}


function getCompanyLogo(content) {
    const regex = /!\[(.*?)\]\((.*?)\)/gms;

    let result;
    let m;

    while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex == 2) {
                result = match;
            }
        });
    }
    return result;
}


function getYoutubeThumbnail(link) {
    const regex = /(?<=v=)[a-zA-Z0-9]+/gm;
    let match = regex.exec(link);
    return `https://img.youtube.com/vi/${match[0]}/0.jpg`;
}
function downloadImgFile(link, fileName) {

    var exec = require('child_process').exec,
        child;
    fileName = fileName.replace(" ", "\\ ");
    const call = `curl --location --request GET '${link}' --header 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36' > ${fileName}`;

    child = exec(call, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });


}
const AdmZip = require('adm-zip');
const fileName = "./Export-15a220e5-9f32-4501-9456-2320c3d9d915.zip";
const zip = new AdmZip(fileName);
const targetDir = './result';
zip.extractAllTo(targetDir, true);
const files = fs.readdirSync(targetDir);
let fileContents;
files.forEach(file => {
    if (file.endsWith('.md')) {
        fileContents = fs.readFileSync(`${targetDir}/${file}`, 'utf8');
    }
})
k = getJson(fileContents, targetDir)
console.log(k)
