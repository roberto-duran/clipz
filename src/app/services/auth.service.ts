import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import IUser from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private auth: AngularFireAuth,
        private db: AngularFirestore
    ) {}

    public async createUser(userData: IUser){

        const userCred = await this.auth.createUserWithEmailAndPassword(
            userData.email as string, userData.password as string
        )
        await this.db.collection('users').add({
            name: userData.name,
            email: userData.email,
            age: userData.age,
            phone: userData.phone
        })
    }
}
