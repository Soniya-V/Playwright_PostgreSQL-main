import { test, expect } from '@playwright/test';
import { Client } from "pg";
import * as dotenv from 'dotenv'
import fs from 'fs';
import { JsonOperations } from 'D:/Playwright_PostgreSQL-main/Playwright_PostgreSQL-main/src/utility/jsonOperations';
import { DbUtils } from 'D:/Playwright_PostgreSQL-main/Playwright_PostgreSQL-main/src/utility/dbUtils';
dotenv.config()
let jsonUtil = new JsonOperations()
let dbutils = new DbUtils()



const testData = {
    //actor_id: 300,
    brand: "Hyndai",
    model: "xyzz",
    year: 2024
};

test('Test Case 01: Validate select query from DB', async () => {
    const query = 'SELECT brand, model, year FROM public.cars'
    await dbutils.selectValues(query,'SelectValues.json')
});



test('Test Case 02: Insert INTO cars', async () => {

    const query = `INSERT INTO cars(brand, model, year)
                         VALUES ('${testData.brand}', '${testData.model}', '${testData.year}');`
    await dbutils.insertquery(query)
});

test('Test Case 03: SELECT new inserted record', async () => {

    const query = `SELECT * FROM public.cars WHERE brand = 'Hyndai'`;
    await dbutils.queryResultAfterNewRecord(query)
});


test('Test Case 04: UPDATE inserted cars', async () => {

    const newTestData = {
        brand: "Kia",
        model: "seltos"
    }

    const query = `UPDATE cars SET brand = '${newTestData.brand}', model = '${newTestData.model}'
                         WHERE year = ${testData.year}`;
    await dbutils.updatequery(query)
});


test('Test Case 05: DELETE cars', async () => {

    const query = `DELETE FROM cars WHERE model = 'seltos'`;
    await dbutils.deletequery(query)
});
test('Test Case 06: Validate select query after delete', async () => {
    const query = 'SELECT brand, model, year FROM public.cars'
    await dbutils.selectValues(query,'SelectValuesAfterDelete.json')
});
test('Test Case 07: Create Table ', async () => {
    const query = 'CREATE TABLE Emp2 (EmployeeID INT PRIMARY KEY, FirstName VARCHAR(50),LastName VARCHAR(50),Department VARCHAR(50),Salary DECIMAL(10, 2));'
    await dbutils.createTable(query)
});

test('Test Case 08: Create Table ', async () => {
    const query = 'CREATE TABLE Emp2 (EmployeeID INT PRIMARY KEY, FirstName VARCHAR(50),LastName VARCHAR(50),Department VARCHAR(50),Salary DECIMAL(10, 2));'
    await dbutils.createTable_newdb(query)
});
test('Test Case 09: Insert INTO Emp2', async () => {

    const query = `INSERT INTO Emp2(EmployeeID, FirstName, LastName, Department, Salary)
                         VALUES (111, 'soniya', 'V', 'CSC', 10000);`
    await dbutils.insertquery1(query)
});
test('Test Case 10: Insert INTO Emp2', async () => {

    const query = `INSERT INTO Emp2(EmployeeID, FirstName, LastName, Department, Salary)
                         VALUES (111, 'soniya', 'V', 'CSC', 10000);`
    await dbutils.insertquery(query)
});
