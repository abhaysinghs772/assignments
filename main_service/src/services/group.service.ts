import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { User, Group } from "../entities";

export class GroupService {
    constructor(
        // @InjectRepository()
    ){}

    getDatSource(){
        return 
    }

    getGroupRespo(){
        return
    }

    async createGroup() {
        return " hello "; 
    }
}