import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {


    projects: [
        {
             name: "Firefox",
             use: {
                ...devices["Desktop Firefox"]
             }
        },
    ],

    //testMatch: ["tests/dbDataIntegrity.test.ts"],
    //testMatch: ["tests/dbCrud.test.ts"],
    testMatch: ["tests/dbCrud.test.ts","tests/dbSchema.test.ts","tests/dbDataIntegrity.test.ts"],

    use: {
        headless: true,
        screenshot: "on", 
    },

    retries: 3,

    reporter: [
      ["json", {
          outputFile: "jsonReports/jsonReport.json"
      }], 
  
      ["html", {
          open: "always"
      }]
  ]

};


export default config;