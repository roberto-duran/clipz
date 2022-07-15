import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs';
import IUser from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userCollection: AngularFirestoreCollection<IUser>
    public IsAuthenticated$: Observable<boolean>
    public IsAuthenticatedWithDelay$: Observable<boolean>
    constructor(
        private auth: AngularFireAuth,
        private db: AngularFirestore
    ) {
        this.userCollection = db.collection('users')
        this.IsAuthenticated$ = auth.user.pipe(
            map(user => !!user)
        )
        this.IsAuthenticatedWithDelay$ = this.IsAuthenticated$.pipe(
            delay(1000)
        )
    }

    public async createUser(userData: IUser) {
        if (!userData.password) {
            throw new Error("Password not provided")
        }
        const userCred = await this.auth.createUserWithEmailAndPassword(
            userData.email as string, userData.password as string
        )
        if (!userCred.user) {
            throw new Error("User not found")
        }
        await this.userCollection.doc(userCred.user.uid).set({
            name: userData.name,
            email: userData.email,
            age: userData.age,
            phone: userData.phone
        })

        await userCred.user.updateProfile({
            displayName: userData.name
        })
    }
}
