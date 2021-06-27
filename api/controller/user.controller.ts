import { FieldInfo, MysqlError, OkPacket } from 'mysql';
import { NextFunction, Request, Response } from 'express';
import pool from '../../config/db.config'
import User from '../../models/user.model'
import bcrypt from 'bcrypt'

const userExists = async (username: string) => {
    const sql = `Select username from users Where username = '${username}'`;

    try {
        const result: boolean = await new Promise((resolve, reject) => {
            pool.query(sql, (error: MysqlError, results: any, fields: FieldInfo[]) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            })
        });

        return result;

    } catch (error) {
        console.error(error);
    }
}

const encryptPassword = async (password: string) => {
    const saltRounds = 10;
    try {
        const result: string = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (!err) {
                    resolve(hash);
                } else {
                    reject(err);
                }
            });
        });


        return result;

    } catch (error) {
        console.error(error);
    }
}

export const login = async (req: Request, res: Response) => {
    const user: User = {
        username : req.body.username,
        password : req.body.password
    }
}

export const register = async (req: Request, res: Response) => {
    const user: User = {
        username: req.body.username,
        password: req.body.password
    }

    const enPass = await encryptPassword(user.password);

    user.password = enPass!;

    if (await userExists(user.username) === true) {
        res.status(409).send({
            message: 'username exists'
        });
        return;
    }

    const sql = `Insert into users set ?`;
    try {
        const result: OkPacket = await new Promise((resolve, reject) => {
            pool.query(sql, user, (err: MysqlError | null, results: any, fields: FieldInfo[] | undefined) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (result.insertId !== null) {
            res.status(201).send('user created.');
        }

    } catch (error) {
        res.status(500).send({
            serverError: error
        });
    }
};

export const getById = async (req: Request, res: Response) => {
    let id: string = req.params.id;

    const sql: string = `Select username, password from users Where id = ${id}`;

    try {
        const result: Array<User> = await new Promise((resolve, reject) => {
            pool.query(sql, (err: MysqlError | null, results: any, fields: FieldInfo[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            })
        });

        if (result.length != 0) {
            const userData : User = {
                username: result[0].username,
                password: result[0].password
            }
    
            res.status(200).send(userData);
            return;
        }

        res.status(404).send({
            message: 'user not found.'
        }).end();

        
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getUser = async (req: Request, res: Response) => {
    const sql = `Select username, password from users`;

    try {
        const result: Array<User> = await new Promise((resolve, reject) => {
            pool.query(sql, (error: MysqlError, results: any, fields: FieldInfo[]) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        if (result.length !== 0) {
            res.status(200).send(result)
        }
    } catch (error) {
        res.status(500).send({
            serverError: error
        });
    }
};
