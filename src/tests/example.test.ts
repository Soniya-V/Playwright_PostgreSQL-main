import { test, expect } from '@playwright/test';
import { Client } from "pg";
import * as dotenv from 'dotenv'
import fs from 'fs';
import { JsonOperations } from '../utility/jsonOperations';
//import { exec } from 'child_process';
dotenv.config()
let jsonUtil = new JsonOperations()


const client = new Client({
   
    host: `${process.env.host}`,
    user: `${process.env.user}`,
    port: `${process.env.port}`, //Please insert your valid port form your PostgreSQL DB
    password: `${process.env.password}`, // Your password
    database: `${process.env.database}`// Your name of database
});

const testData = {
    //actor_id: 300,
    brand: "Hyndai",
    model: "xyzz",
    year: 2024
};

test.beforeAll(async ({}) => {
    console.log('=========== Tests started ===========')
    await client.connect();
});

test.afterAll(async ({}) => {
    await client.end();
    console.log('=========== Tests stoped ===========')
});

async function fetchData(request: Client.query): Promise<any[]> {
    try {
        const result = await client.query(request);
        return result.rows;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return [];
    }
  }


test('Test Case 01: Validate select query from DB', async () => {
    const query = 'SELECT brand, model, year FROM public.cars'

    try {
        const queryResult = await client.query(query);
        const data = await fetchData(query)
        console.log(queryResult.rows);
        await jsonUtil.writeDataToJsonFile('overallData.json',data);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
});

  function writeDataToJson(data: any[]): void {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync('data.json', jsonData);
        console.log('Data exported to data.json successfully!');
    } catch (error) {
        console.error('Error writing data to JSON file:', error.message);
    }
  }
  


// test('Test Case 02: Insert INTO cars', async () => {

//     const insertQuery = `INSERT INTO cars(brand, model, year)
//                          VALUES ('${testData.brand}', '${testData.model}', '${testData.year}');`

//     try {

//         const queryResult = await client.query(insertQuery);
//         //expect(queryResult.rowCount).toBe(1);
//         expect(queryResult.command).toBe('INSERT');

//     } catch (err) {
//         console.error(err.message);
//         throw err;
//     }
// });

// test('Test Case 03: SELECT new inserted record', async () => {

//     const selectQuery = `SELECT * FROM public.cars WHERE brand = 'Hyndai'`;

//     try {
//         const selectResult = await client.query(selectQuery);

//         const firstRow = selectResult.rows[0];
//         expect(firstRow.brand).toBe(testData.brand);
//         expect(firstRow.model).toBe('xyzz');
//         expect(firstRow.year).toBe(2024);
//         console.log(selectResult.rows[0])
//     } catch (err) {
//         console.error(err.message);
//         throw err;;
//     }
// });


// test('Test Case 04: UPDATE inserted cars', async () => {

//     const newTestData = {
//         brand: "Kia",
//         model: "seltos"
//     }

//     const selectQuery = `UPDATE cars SET brand = '${newTestData.brand}', model = '${newTestData.model}'
//                          WHERE year = ${testData.year}`;

//     try {
//         const selectResult = await client.query(selectQuery);

//         expect(selectResult.rowCount).toBe(1);
//         expect(selectResult.command).toBe('UPDATE')

//     } catch (err) {
//         console.error(err.message);
//         throw err;;
//     }
// });


// test('Test Case 05: DELETE cars', async () => {

//     const deleteQuery = `DELETE FROM cars WHERE model = 'seltos'`;

//     try {
//         const deleteResult = await client.query(deleteQuery);

//         expect(deleteResult.rowCount).toBe(1);
//         expect(deleteResult.command).toBe('DELETE')

//     } catch (err) {
//         console.error(err.message);
//         throw err;;
//     }
// });
// test('Test Case 06: Validate select query after delete', async () => {
//     const query = 'SELECT brand, model, year FROM public.cars'

//     try {
//         const queryResult = await client.query(query);
//         console.log(queryResult.rows);
//     } catch (err) {
//         console.error(err.message);
//         throw err;
//     }
// });
// test('Test Case 07: Create Table ', async () => {
//     const query = 'CREATE TABLE Emp (EmployeeID INT PRIMARY KEY, FirstName VARCHAR(50),LastName VARCHAR(50),Department VARCHAR(50),Salary DECIMAL(10, 2));'

//     try {
//         const queryResult = await client.query(query);
//         console.log(queryResult.rows);
//     } catch (err) {
//         console.error(err.message);
//         console.log("Table already exist");
//         throw err;
//     }
// });



test('Test Case 08: Schema Testing for the Column ', async () => {

    const query = `SELECT count(*) As NumberofColumns FROM information_schema.columns WHERE table_name = 'cars'`;

    try {
        const queryResult = await client.query(query);
        console.log(queryResult.rows);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
});

test('Test Case 08: Schema Testing for for the Column_name ', async () => {

    const query = `SELECT column_name FROM information_schema.columns WHERE table_name = 'cars'`;

    try {
        const queryResult = await client.query(query);
        console.log(queryResult.rows);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
});