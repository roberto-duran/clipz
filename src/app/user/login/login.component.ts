import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {FormsModule} from "@angular/forms";
import {AlertComponent} from "../../shared/alert/alert.component";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        AlertComponent
    ],
    standalone: true
})
export class LoginComponent implements OnInit {
    credentials = {
        email: '',
        password: ''
    }
    showAlert = false
    alertMsg = 'Please wait! Your account is been created'
    alertColor = 'blue'
    inSubmition = false;
    constructor(private auth: AngularFireAuth) { }

    ngOnInit(): void {
    }
    async login() {
        this.showAlert = true
        this.alertMsg = 'Please wait! Logging in'
        this.alertColor = 'blue'
        this.inSubmition = true
        try {
            await this.auth.signInWithEmailAndPassword(
                this.credentials.email,
                this.credentials.password
            )
        } catch (error) {
            console.error(error)
            this.showAlert = true
            this.alertMsg = 'An unexpected error occurred. Please try again later'
            this.alertColor = 'red'
            this.inSubmition = false;
            return
        }
        this.alertMsg = 'Success! your Log in'
        this.alertColor = 'green'
    }

}
