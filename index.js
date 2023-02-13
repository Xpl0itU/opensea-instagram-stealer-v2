const fs = require("fs");
const { ImgurClient } = require('imgur');
const instagram_upload = require("./instagram_upload");
const Jimp = require("jimp");
const puppeteer = require("puppeteer");

async function scrape() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://opensea.io/assets');

    const element = await page.waitForSelector("main#main>div>div>div>div>div:nth-of-type(3)>div:nth-of-type(3)>div:nth-of-type(3)>div>div:nth-of-type(3)>article>a>div>div>div>div>div>span>img");
    const imageSrc = await element.getProperty("src");
    const imageUrl = imageSrc.toString().substring(9).replace("?auto=format&w=3840", "");

    await page.goto(imageUrl);
    const imageSelector = await page.waitForSelector("img");
    await imageSelector.screenshot({path: "to_upload.jpeg", type: "jpeg", quality: 100});

    await imageSelector.dispose();
    await element.dispose();
    await browser.close();

    const image = await Jimp.read("to_upload.jpeg");
    image.quality(100).write("to_upload_converted.jpeg");
    fs.unlinkSync("to_upload.jpeg");
}

function onSuccess() {
    console.log("Successfully uploaded image");
}

function onError(error) {
    console.log("Error while uploading image");
    console.log(error);
}

(async () => {
    require('dotenv').config();
    await scrape();
    const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID });
    const response = await client.upload({
        image: fs.createReadStream('to_upload_converted.jpeg'),
        type: 'stream',
      });
    const imgurImgUrl = response.data.link;
    console.log(imgurImgUrl);
    const dots = `•\n•\n•\n•\n•`;
    const captions = [
        "#nfts #nft #nftart #nftcommunity #nftcollector #nftartist #crypto #digitalart #cryptoart #art #ethereum #opensea #nftcollectors #blockchain #nftdrop #cryptocurrency #nftcollectibles #bitcoin #openseanft #nftcollection #cryptoartist #nftartists #eth #nftartgallery #artist #metaverse #nftartwork #artwork #d #artoftheday",
        "#nftgallery #contemporaryart #nftnews #nftgiveaway #raredigitalart #rarible #btc #cryptonews #nftsstories #digitalartist #digitalcollectibles #defi #modernart #nftmarketplace #design #animation #polygon #artgallery #abstractart #dart #cryptotrading #nonfungibletokens #nftdrops #pixelart #nftmagazine #digitalillustration #meta #nfthesearch #cryptopunks #investing",
        "#nft #nftart #art #nfts #crypto #nftartist #digitalart #nftcommunity #nftcollector #cryptoart #ethereum #cryptocurrency #opensea #bitcoin #blockchain #d #artist #eth #metaverse #nftcollectors #artwork #nftdrop #nftcollectibles #btc #openseanft #nftcollection #cryptoartist #contemporaryart #nftartists #defi",
        "#nftartgallery #artoftheday #design #cryptonews #illustration #binance #dart #abstractart #nftartwork #digitalartist #blender #modernart #rarible #abstract #cryptotrading #artgallery #painting #artistsoninstagram #digital #love #dogecoin #animation #drawing #pixelart #nftgallery #polygon #graphicdesign #photography #nftnews #artcollector",
        "#abstractart #crypto #nfts #abstract #blockchain #metaverse #artistsofinstagram #cryptoartist #surrealism #abstraction #cryptocurrencies #surrealart #aiart #abstractexpressionism #generativeart #digitalcollage #cryptoworld #cryptoinvestor #altcoin #cardano #abstractartwork #cyber #cripto #raredigitalart #cryptocurrencynews #cryptomarket #blockchains #blockchainnews #cryptoinvesting #newmediaart",
        "#nft #nftart #art #digitalart #nfts #nftartist #crypto #cryptoart #nftcommunity #nftcollector #ethereum #bitcoin #blockchain #cryptocurrency #d #opensea #artist #artwork #eth #nftcollectors #cryptoartist #contemporaryart #nftdrop #nftcollectibles #btc #openseanft #defi #design #artoftheday",
        "#nftartists #dart #metaverse #nftcollection #blender #cryptonews #rarible #binance #abstractart #abstract #artgallery #modernart #painting #nftartgallery #cryptotrading #animation #pixelart #digitalartist #digital #drawing #dogecoin #artistsoninstagram #raredigitalart #artcollector #nftartwork #music #photography #love #cardano",
        "#nfts #crypto #blockchain #btc #digitalartist #ethereum #collectibles #pixelart #blender #eth #cryptocurrencies #cryptotrading #cryptonews #binance",
        "#nft #nftart #art #nfts #crypto #nftartist #digitalart #nftcommunity #nftcollector #cryptoart #ethereum #cryptocurrency #opensea #bitcoin #blockchain #d #artist #eth #metaverse #nftcollectors #artwork #nftdrop #nftcollectibles #btc #openseanft #nftcollection #cryptoartist #contemporaryart #nftartists #defi",
        "#nftartgallery #artoftheday #design #cryptonews #illustration #binance #dart #abstractart #nftartwork #digitalartist #blender #modernart #rarible #abstract #cryptotrading #artgallery #painting #artistsoninstagram #digital #love #dogecoin #animation #drawing #pixelart #nftgallery #polygon #graphicdesign #photography #nftnews #artcollector",
    ];
    const captionEncoded = `For more follow @recent.nft\n${dots}\n${captions[Math.floor(Math.random() * captions.length)]}`;

    instagram_upload.uploadtoInstagram(process.env.INSTAGRAM_TOKEN, process.env.INSTAGRAM_USER_ID, "https://i.imgur.com/YYB8Q5h.jpg", captionEncoded, onSuccess, onError);
})();