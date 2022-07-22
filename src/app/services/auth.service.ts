import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { Observable, of, switchMap } from 'rxjs';
import { map, delay, filter } from 'rxjs';

import IUser from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userCollection: AngularFirestoreCollection<IUser>
    private redirect = false
    public IsAuthenticated$: Observable<boolean>
    public IsAuthenticatedWithDelay$: Observable<boolean>

    constructor(
        private auth: AngularFireAuth,
        private db: AngularFirestore,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.userCollection = db.collection('users')
        this.IsAuthenticated$ = auth.user.pipe(
            map(user => !!user)
        )
        this.IsAuthenticatedWithDelay$ = this.IsAuthenticated$.pipe(
            delay(1000)
        )
        this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            map(e => this.route.firstChild),
            switchMap(rotue => rotue?.data ?? of({}))
        ).subscribe(data => {
            this.redirect = data.authOnly ?? false
        })
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

    public async logout($event?: Event) {
        if ($event) {
            $event.preventDefault()
        }
        await this.auth.signOut()

        if (this.redirect) {
            await this.router.navigateByUrl('/')
        }
    }
}
