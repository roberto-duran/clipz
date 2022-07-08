import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import IUser from "../../models/user.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    inSubmission = false
    constructor(private auth: AuthService) {}

    name = new FormControl('', [
        Validators.required, Validators.minLength(3)
    ])
    email = new FormControl('',
        [
            Validators.required,
            Validators.email
        ])
    age = new FormControl <number | null>(null,
        [
            Validators.required,
            Validators.min(18),
            Validators.max(120)
        ])
    password = new FormControl('',
        [
            Validators.required,
            Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
        ])
    confirm_password = new FormControl('',
        [
            Validators.required
        ])
    phone = new FormControl('',
        [
            Validators.required,
            Validators.minLength(14),
            Validators.maxLength(14)
        ])

    showAlert = false
    alertMsg = 'Please wait! Your account is been created'
    alertColor = 'blue'
    registerForm = new FormGroup({
        name: this.name,
        email: this.email,
        age: this.age,
        password: this.password,
        confirm_password: this.confirm_password,
        phone: this.phone
    })

    async register() {
        this.showAlert = true
        this.alertMsg = 'Please wait! Your account is been created'
        this.alertColor = 'blue'
        this.inSubmission = true

        try{
            await this.auth.createUser(this.registerForm.value as IUser)
        } catch (e){
            console.error(e)
            this.alertMsg = 'An unexpected error occurred. Please try again later'
            this.alertColor = 'red'
            this.inSubmission = false
            return
        }
        this.alertMsg = 'Success! Your account has been created.'
        this.alertColor = 'green'

    }
}
