import fs from 'fs';
import { promises as fsPromises } from 'fs'
import { LoggerUtil } from "./logger";

let log = new LoggerUtil()

let jsondataDir = "./src/resources/data/"
let jsondataDirCreate ="./src/resources/data/CreatedData/"
let jsondataDirUpdate ="./src/resources/data/UpdatedData/"
let jsondataDirSelect = "./src/resources/data/ExistingData/"
let jsondataDirTemp = "./src/resources/data/tempFiles/"

let jsondataDirJsonConfig ="./src/reporter/"

export class JsonOperations{
/*Json file reader and Fetching Json Data*/  
async readData(fileName) {
  try {
    // read the JSON file
    const fileData = await fs.promises.readFile(`${jsondataDir}${fileName}`, 'utf-8');

    // parse the JSON data
    let jsonData = JSON.parse(fileData);
    return jsonData

  } catch (err) {
    console.error(err);
  }
} 

/*Read Text File*/
async readTextFile(filepath: string): Promise<string> {
    const data = await fs.promises.readFile(filepath, 'utf8');
    return data;
  }

/*Generate new data Name field */
async getNewLabelName(){
         const newlabel = this.getNewLabelName()
         return newlabel
        }    
/*Json file creation and writing Json Data*/
//It will create new file with the given data. 
//If the file is already exist it will remove the previous one and replace with the new one.
async createJsonData(fileName,jsonData:any){
  try {
    // write the updated data to the file
    await fs.promises.writeFile(`${jsondataDirTemp}${fileName}`, JSON.stringify(jsonData,null,2),{ flag: 'w' });
  } catch (err) {
    console.error(err);
  }
}


    async appendJsonData(fileName,jsonData:any){
        // Read existing data from file
        let existingData = {};
        if (fs.existsSync(`${jsondataDirTemp}${fileName}`)) {
        try {
            const data = await fs.promises.readFile(`${jsondataDirTemp}${fileName}`, 'utf-8');
            existingData = JSON.parse(data) || {};
        } catch (err) {
            console.error(`Failed to read file: ${err}`);
        }
        }

        // Append new data to existing data
        const combinedData = {
        ...existingData,
        ...jsonData
        };

        // Write combined data to file
        try {
        await fs.promises.writeFile(`${jsondataDirTemp}${fileName}`, JSON.stringify(combinedData, null, 2),{ flag: 'w' });
        console.log('Data written to file successfully.');
        } catch (err) {
        console.error(`Failed to write file: ${err}`);
        }
            }


    /*For Payroll Calculation Data storage*/


async deleteFile(fileName) {
  try {
      await fs.promises.unlink(`${jsondataDir}${fileName}`)
      if (await fs.existsSync(`${jsondataDir}${fileName}`)) {
          await log.warn("file still exists:",`${jsondataDir}${fileName}`);
      } else {
          await log.info("file is deleted:", `${jsondataDir}${fileName}`);
      }
  } catch (error) {
      await log.info("Exception Occured"+error);
  }
}

async deleteTempFiles(){
  const files = await fs.promises.readdir(`${jsondataDirTemp}`);
  await log.info("Deleting Temp Files...")
  for (const file of files) {
    const filePath = `${jsondataDirTemp}/${file}`;
    await fs.promises.unlink(filePath);
    await log.info(`Successfully deleted ${filePath}`);
  }
}

async  writeDataToJsonFile(filename: string, data: any): Promise<void> {
    const filePath = `${jsondataDir}${filename}` //path.join(__dirname, filename);
  
    let existingData: any = null;
    try {
      existingData = await this.readData(filename);
    } catch (err) {
      // File doesn't exist, do nothing
    }
  
    if (existingData) {
      // Append to existing data
      const newData = [...existingData, data];
      await fs.promises.writeFile(filePath, JSON.stringify(newData, null, 2));
    } else {
      // Create new file
      await fs.promises.writeFile(filePath, JSON.stringify([data], null, 2));
    }
  }





// 
async writeDataToTextFile(fileName: string, data: any): Promise<void> {
    let dataString = data.toString();
    const filename = `${jsondataDirTemp}${fileName}.txt` //path.join(__dirname, filename);
 
 
 
   let existingData: any = null;
 
   try {
 
    existingData = await this.readTextFile(filename);
 
   } catch (err) {
     console.log(err)
    // File doesn't exist, do nothingc
     
   }
 
 
 
   if (existingData) {
 
    // Append to existing data
 
 //    const newData = [...existingData, data];
    
    const newData = existingData + '\n' + dataString;
    await fs.promises.writeFile(filename, newData);
    console.log("File appended")
 
   } else {
 
    // Create new file
 
    await fs.promises.writeFile(filename, dataString, { flag: 'w'});
    console.log("new file created")
 
   }
 
  }

  async writeDataToTextFileSpecificLocation(path,fileName: string, data: any): Promise<void> {
    let dataString = data.toString();
    const filename = `${path}${fileName}.txt` //path.join(__dirname, filename);
 
 
 
   let existingData: any = null;
 
   try {
 
    existingData = await this.readTextFile(filename);
 
   } catch (err) {
     console.log(err)
    // File doesn't exist, do nothingc
     
   }
 
 
 
   if (existingData) {
 
    // Append to existing data
 
 //    const newData = [...existingData, data];
    
    const newData = existingData + '\n' + dataString;
    await fs.promises.writeFile(filename, newData);
    console.log("File appended")
 
   } else {
 
    // Create new file
 
    await fs.promises.writeFile(filename, dataString, { flag: 'w'});
    console.log("new file created")
 
   }
 
  }



async replaceWordInFile(filePath: string, oldWord: string, newWord: string) {
  try {
    // Read the file contents
    const data = await fs.promises.readFile(filePath, 'utf8');

    // Replace the word in the content
    const updatedContent = data.replace(new RegExp(oldWord, 'g'), newWord);

    // Write the modified content back to the file
    await fs.promises.writeFile(filePath, updatedContent, 'utf8');

    console.log('File updated successfully!');
    return updatedContent
  } catch (err) {
    console.error('Error:', err);
  }
}


}



