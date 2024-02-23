import { test, expect } from '@playwright/test';
import { Client } from "pg";
import * as dotenv from 'dotenv'
import csvParser from 'csv-parser';
import path from 'path';
import {parse} from 'csv-parse/sync';
import fs from 'fs';
import { JsonOperations } from '../utility/jsonOperations';
import { DatabaseError } from 'database-error';


dotenv.config()
let jsonUtil = new JsonOperations()
const csvFilePath = 'D:/Soniya_DB/books.csv';

const client = new Client({
   
    host: `${process.env.host}`,
    user: `${process.env.user}`,
    port: `${process.env.port}`, //Please insert your valid port form your PostgreSQL DB
    password: `${process.env.password}`, // Your password
    database: `${process.env.database1}`// Your name of database
});

const client1 = new Client({
   
    host: `${process.env.host}`,
    user: `${process.env.user}`,
    port: `${process.env.port}`, //Please insert your valid port form your PostgreSQL DB
    password: `${process.env.password}`, // Your password
    database: `${process.env.database2}`// Your name of database
});


test.beforeAll(async ({}) => {
    console.log('=========== Tests started ===========')
    await client.connect();
    await client1.connect();
});

test.afterAll(async ({}) => {
    await client.end();
    await client1.end();
    console.log('=========== Tests stoped ===========')
});


export class DbUtils{    
    async insertMultiple(csvFilePath: string) {
    
        try {
            if (!client || !client.isConnected) {
                throw new Error('Database client is not connected.');
            }
            if (!client.isConnected) {
                await client.connect();
            }
            
          //await client.connect();
          fs.createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', async (row: any) => {
                console.log(row)
              try {
                await client.query(
                    `INSERT INTO courses (CourseID, CourseName, Duration, Fee) 
                     VALUES ($1, $2, $3, $4)`,
                    [row.CourseID, row.CourseName, row.Duration, row.Fee]
                  );
              } catch (error) {
                console.error('Error inserting row:', error);
              }
            })
            .on('end', () => {
                console.log('CSV file successfully processed.');
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
            });
        } catch (error) {
          console.error('Error:', error);
        } 
      }

async createTable(Query){

        const query = Query;
        try {
            const queryResult = await client.query(query);
            console.log(queryResult.rows);
        } catch (err) {
            console.error(err.message);
            console.log("Table already exist");
            //throw err;
        }
    
}
async createTable_newdb(Query){

    const query = Query;
    try {
        const queryResult = await client1.query(query);
        console.log(queryResult.rows);
    } catch (err) {
        console.error(err.message);
        console.log("Table already exist");
        //throw err;
    }

}

async selectValues(Query, filename){

        const query = Query;
        try {
            const queryResult = await client.query(query);
            const data = await this.fetchData(query)
            console.log(queryResult.rows);
            await jsonUtil.writeDataToJsonFile(filename,data);
        } catch (err) {
            console.error(err.message);
            throw err;
        }
    
}
async selectValuesDM(Query){

    const query = Query;
    try {
        const queryResult = await client.query(query);
        const data = await this.fetchData(query)
        console.log(queryResult.rows);
        //await jsonUtil.writeDataToJsonFile(data);
    } catch (err) {
        console.error(err.message);
        throw err;
    }

}
async dataMigration(){
    

    try {
        
        // Fetch data from the original table from DB1
        const originalDataResult = await client.query(`
            SELECT *
            FROM Emp2
        `);
  
        // Fetch data from the migrated table from db2
        const migratedDataResult = await client1.query(`
            SELECT *
            FROM Emp2
        `);
  
        // Verify data migration
        expect(originalDataResult.rows.length).toEqual(migratedDataResult.rows.length);
  
        // Compare each row to ensure data consistency
        for (let i = 0; i < originalDataResult.rows.length; i++) {
            const originalRow = originalDataResult.rows[i];
            const migratedRow = migratedDataResult.rows[i];
            await console.log(originalRow)
            await console.log(migratedRow)
        
  
            // Compare each column value
            Object.keys(originalRow).forEach(columnName => {
                console.log('Column Name:', columnName);
                expect(originalRow[columnName]).toEqual(migratedRow[columnName]);  
            });
            console.log('Column Names are equal');
        }
    } catch (error) {
        console.error('Error:', error.message);
    } 

}

async insertquery(Query){

    const query = Query;
    try {
        const queryResult = await client.query(query);
        expect(queryResult.command).toBe('INSERT');
        console.log(queryResult.rows);
    } catch (err) {
        if (err.message.match(/duplicate key value violates unique constraint/)) {  

              console.error("duplicate key value violates unique constraint");
        }
        else if(err.message.match(/null value in column/)){

        console.error("null value in column courseid of relation courses violates not-null constraint");
        }
        else if(err.message.match(/violates check constraint/)){
            
            console.error("new row for relation courses violates check constraint courses_fee_check");
        }
        else {
            console.error(err.message);
          }
        
        throw err;
    }

}
async insertquery1(Query){

    const query = Query;
    try {
        const queryResult = await client1.query(query);
        expect(queryResult.command).toBe('INSERT');
        console.log(queryResult.rows);
    } catch (err) {
        
            console.error(err.message);
        
        throw err;
    }

}

async updatequery(Query){

    const query = Query;
    try {
        const queryResult = await client.query(query);
        expect(queryResult.command).toBe('UPDATE')
        console.log(queryResult.rows);
    } catch (err) {
        console.error(err.message);
        throw err;
    }

}
async deletequery(Query){

    const query = Query;
    try {
        const queryResult = await client.query(query);
        expect(queryResult.command).toBe('DELETE')
        console.log(queryResult.rows);
    } catch (err) {
        console.error(err.message);
        throw err;
    }

}
async queryResultAfterNewRecord(Query){

    const query = Query;
    try {
        const selectResult = await client.query(query);

        const firstRow = selectResult.rows[0];
        expect(firstRow.brand).toBe('Hyndai');
        expect(firstRow.model).toBe('xyzz');
        expect(firstRow.year).toBe(2024);
        console.log(selectResult.rows[0])
    } catch (err) {
        console.error(err.message);
        throw err;;
    }

}
async fetchData(request: Client.query): Promise<any[]> {
    try {
        const result = await client.query(request);
        return result.rows;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return [];
    }
  }
}