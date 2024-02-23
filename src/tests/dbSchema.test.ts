import { test, expect } from '@playwright/test';
import { Client } from "pg";
import * as dotenv from 'dotenv'
import fs from 'fs';
import { JsonOperations } from 'D:/Playwright_PostgreSQL-main/Playwright_PostgreSQL-main/src/utility/jsonOperations';
import { DbUtils } from 'D:/Playwright_PostgreSQL-main/Playwright_PostgreSQL-main/src/utility/dbUtils';
dotenv.config()
let jsonUtil = new JsonOperations()
let dbutils = new DbUtils()


//Check Number of Columns
test('Schema Testing for the Column ', async () => {

    const query = `SELECT count(*) As NumberofColumns FROM information_schema.columns WHERE table_name = 'cars'`;
    await dbutils.selectValues(query,'Schematest1.json')
});
//Check Column name
test('Schema Testing for for the Column_name ', async () => {

    const query = `SELECT column_name FROM information_schema.columns WHERE table_name = 'cars'`;
    await dbutils.selectValues(query,'Schematest2.json')
});

//Check Column name along with datatype datatype 
test('Schema Testing for the Column_name with data type ', async () => {

    const query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'cars'`;
    await dbutils.selectValues(query,'Schematest3.json')
});
//Check nulls fields in a table 
test('Schema Testing to check null field ', async () => {

    const query = `SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'cars'`;
    await dbutils.selectValues(query,'Schematest4.json')
});

//Check column keys in a table 
test('Test Case 12: Schema Testing to Check column keys in a table ', async () => {

    const query = `SELECT column_name, column_key FROM information_schema.columns WHERE table_name = 'cars'`;
    await dbutils.selectValues(query,'Schematest5.json')

});
