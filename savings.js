
import fs from "node:fs/promises";
import path from "node:path";

const mainFolder =  import.meta.dirname;
const createFolder = async (pokemonName) => {
    let pokemonFolder = path.join(mainFolder, "downloads",`${pokemonName}`);
    //console.log(pokemonFolder);
    let count = 1;
    let folderExists = async (path) => {
        try {
            //console.log("start accessing");
            await fs.access(path);
            //console.log("found!");
            return true;
        } catch(err) {
            //console.log("not found");
            return false;
        }
    };
    let exists = await folderExists(pokemonFolder);
    while(exists){
        pokemonFolder = path.join(mainFolder,"downloads",`${pokemonName}-${count}`);
       exists= await folderExists(pokemonFolder);
       // console.log(exists);
        count++;
       // console.log(count);
       // console.log(pokemonFolder);
    }
    await fs.mkdir(pokemonFolder);
    return {
        path : pokemonFolder,
        folderName : path.basename(pokemonFolder)
        } ;
};

const saveImageFile = async (location,pic,nameOfFolderName,nameOfImage) => {
    const image = new Uint8Array( await pic.arrayBuffer());
    const pathOfFile = path.join(location,`${nameOfImage}.png`);
    await fs.writeFile(pathOfFile,image);
    console.log(`Saved: ${nameOfFolderName}/${nameOfImage}.png`);
};

const saveTextFile = async (location,data,nameOfFolderName) => {
    const text = data;
    const pathOfFile = path.join(location,`stats.txt`);
    await fs.writeFile(pathOfFile,text);
    console.log(`Saved: ${nameOfFolderName}/stats.txt`);
};

const savePokemonStats = async (stats,location,nameOfFolderName) => {
    let content = "";
    stats.forEach((ele) => {
        content += `${ele.stat.name}: ${ele.base_stat} \n`;
    });
    await saveTextFile(location,content,nameOfFolderName);

};

const savePokemonSprites = async (sprites,location,nameOfFolderName) => {
    const variations = ["back_shiny","back_female","front_shiny","back_default"
    ,"front_female","front_default","back_shiny_female","front_shiny_female"];
    for(const ele of variations){
        if(sprites[ele]){
            const image = await fetch(sprites[ele]);
            const imageBlob = await image.blob();
            await saveImageFile(location,imageBlob,nameOfFolderName,ele)

        }
    }    

}

const savePokemonArtwork = async (sprites,location,nameOfFolderName) => {
    const nameOfImage = "official-artwork";
    const image = await fetch(sprites.other["official-artwork"].front_default);
    const imageBlob = await image.blob();
    await saveImageFile(location,imageBlob,nameOfFolderName,nameOfImage)
}


// let data = await createFolder("pika");
// let location = data.path;
// let name = data.folderName;
// console.log(name);
// saveImageFile(location,await fetch("https://w.wallhaven.cc/full/3q/wallhaven-3q6m6y.png"),name,"pika");
//createFolder("pika");
//console.log(await createFolder("pika"));
export {createFolder,savePokemonArtwork,savePokemonStats,savePokemonSprites};