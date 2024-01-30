import log4js from "log4js"
var today = new Date()

// var todayDate =

//       today.getFullYear() + "-" + (today.getMonth()+1) + "-" + (today.getDate());

//       process.env.LogPath = "./src/resources/results/"+todayDate+"/gWorks_Automation";



// log4js.configure({

//   appenders: { test: { type: "file", filename: process.env.LogPath+"/gWorks_Automation"+todayDate+today.getTime()+".log" } },

//   categories: { default: {appenders: ["test"], level: "info" } }

// });


export  class LoggerUtil {
   log = log4js.getLogger("test");

   async startFeature(featurename:any) {
        this.info("***************"+featurename +"*******************");
   }

   async endFeature() {
        this.info("***************"+"E--N--D" +"*******************\n\n");
  }

  async startScenario(scenarioName:any) {
    this.info("***"+scenarioName +"***");
  }

  async endScenario(scenarioName:any) {
    this.info("***END***\n\n");
  }

  async trace(message: any, ...args: any[]) {
    this.log.trace(message, ...args);
  }

  async debug(message: any, ...args: any[]) {
    this.log.debug(message, ...args);
  }
  //info(message: any, ...args: any[]): void;
  async info(message: any, ...args: any[]) {
    this.log.info(message, ...args);
    await console.log(message);
    
  }

  async error(message: any, ...args: any[]) {
    this.log.error(message, ...args); 
    console.error(message)  
    throw new Error(message);
  }
  async warn(message: any, ...args: any[]) {
    this.log.debug(message, ...args);
    
  }
  


}