import inquirer from "inquirer";
import {createFolder,savePokemonStats,savePokemonArtwork,savePokemonSprites} from "./savings.js";

const fetchPokemon = async (pokemonName) => {
    const data = await fetch(` https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
   // console.log(data);
    return data;
};

const promptForPokemon = async () => {
   const pokemonName = await inquirer.prompt([
    {
        type: "input",
        name:"pokemonName",
        message:"Pokemon Name:",
        validate: async (input) => {
            if(!input.trim()){
                return "Input cannot be empty.";
            }
            for (const ele of ['!','@','#','$','%','^','&','*','~']) {
                if(input.startsWith(ele)||input.includes(ele)){
                    return "Input cannot have a special symbol.";
                }
            }
            
            return true;
        },
        }
   ]);
   //console.log(pokemonName);
   return pokemonName;
   
};
const promptForDownloadInfo = async () => {
    const info = await inquirer.prompt([
        {
            type:"checkbox",
            name:"selections",
            message:"Pokemon info to download:",
            choices:[
                {name:"Stats", value:"stats",},
                {name:"Sprites", value:"sprites"},
                {name:"Artwork", value:"artwork"}
            ],
            validate: async (input) => {
                if(input.length === 0){
                    return "Select atleast one option."
                }
                return true;
            }
        }
    ]);
    //console.log(info);
    return info;
    
}
const promptToContinue = async () => {
    if(process.stdin.isPaused()) {
    process.stdin.resume();
    }
    const userResponse = await inquirer.prompt([
        {
            type:"select",
            name:"response", 
            message:"Would you like to search for another pokemon?",
            choices:["Yes","No"]
        }
    ]);
    //console.log(userResponse);
    return userResponse;
};
// promptForPokemon();
// promptForDownloadInfo();
// promptToContinue();
 
const promptUser = async () => {
    let correctName = false;
    let nameOfPokemon = "";
    let location = "";
    let json = "";
    let stats = "";
    let sprites = "";
    while(!correctName){
        let pokemonName = await promptForPokemon();
        nameOfPokemon = pokemonName.pokemonName
        try{
            const details = await fetchPokemon(nameOfPokemon);
             if(details.status===404){
                console.log("Enter correct name.");
                correctName = false;  
             }else{
                correctName = true;
                json = await details.json();
                stats = json.stats;
                sprites = json.sprites;
            } 
        } catch(err){
            console.error(err);
        }
       
        // console.log(pokemonName);
    }
    //console.log(stats);
    //console.log(sprites);
    let downloadInfo = await promptForDownloadInfo();
    //console.log(downloadInfo);
    if(!(downloadInfo.selections.length===0)) {
        //console.log("saving");
       location = await createFolder(nameOfPokemon);
        //console.log("saved");
        for (const ele of downloadInfo.selections){
        //await downloadInfo.selections.forEach(async (ele) => {

            if(ele === "stats"){
                await savePokemonStats(stats,location.path,location.folderName);
            } else if(ele === "sprites"){
                await savePokemonSprites(sprites,location.path,location.folderName)
            } else if(ele === "artwork"){
                await savePokemonArtwork(sprites,location.path,location.folderName);
            }
       // });
        }
    }    

    let userResponse = await promptToContinue();
    if(userResponse.response === "Yes"){
       await promptUser();
    }
    //console.log(userResponse);
    process.exit(0);
    
};
promptUser();

export {promptUser};

