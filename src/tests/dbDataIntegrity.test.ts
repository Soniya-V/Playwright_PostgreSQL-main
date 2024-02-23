import { test, expect } from '@playwright/test';
import csvParser from 'csv-parser';
import { Client } from "pg";
import * as dotenv from 'dotenv'
import fs from 'fs';
import {parse} from 'csv-parse/sync';
import path from 'path';
import { JsonOperations } from 'D:/Playwright_PostgreSQL-main/Playwright_PostgreSQL-main/src/utility/jsonOperations';
import { DbUtils } from 'D:/Playwright_PostgreSQL-main/Playwright_PostgreSQL-main/src/utility/dbUtils';
dotenv.config()
let jsonUtil = new JsonOperations()
let dbutils = new DbUtils()

const csvFilePath = 'D:/Soniya_DB/books.csv';

//Check Number of Columns
test('Create Table with following constraints', async () => {

    const query = `CREATE TABLE courses (CourseID INT PRIMARY KEY, CourseName VARCHAR(20) UNIQUE, Duration INT, Fee INT CHECK (Fee BETWEEN 100 and 500))`;
    await dbutils.createTable(query)
});

test('Insert Valid values', async () => {

    const query = `INSERT INTO courses(CourseID, CourseName, Duration, Fee)
    VALUES (111, 'JAVA1', 3, 200);`;
    await dbutils.insertquery(query)
});

test('Insert Same ID values throws error', async () => {

    const query = `INSERT INTO courses(CourseID, CourseName, Duration, Fee)
    VALUES (111, 'python', 2, 300);`;
    await dbutils.insertquery(query)
});

test('Insert Null values throws error', async () => {

    const query = `INSERT INTO courses(CourseID, CourseName, Duration, Fee)
    VALUES (null, 'python', 2, 300);`;
    await dbutils.insertquery(query)
});
test('Insert same values for Unique Constrain throws error', async () => {

    const query = `INSERT INTO courses(CourseID, CourseName, Duration, Fee)
    VALUES (333, 'python', 2, 00);`;
    await dbutils.insertquery(query)
});
test('Insert values crosses check Constrain throws error', async () => {

    const query = `INSERT INTO courses(CourseID, CourseName, Duration, Fee)
    VALUES (400, 'python1', 2, 600);`;
    await dbutils.insertquery(query)
});
test('Insert Multiple values', async () => {
    // const query = `INSERT INTO courses(CourseID, CourseName, Duration, Fee)
    // VALUES (124, 'JAVA9', 3, 200),(125, 'JAVA10', 3, 200), (126, 'JAVA11', 3, 200);`;
    // await dbutils.insertquery1(query)
    await dbutils.insertMultiple(csvFilePath)
});

test('DataMigration Testing', async () => {
    await dbutils.dataMigration()
});