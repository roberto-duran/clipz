import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import IUser from "../../models/user.model";
import {RegisterValidators} from '../validators/register-validators';
import {EmailTaken} from '../validators/email-taken';

import {InputComponent} from 'src/app/shared/input/input.component';
import {AlertComponent} from 'src/app/shared/alert/alert.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        InputComponent,
        AlertComponent,
        ReactiveFormsModule]
})
export class RegisterComponent {
    inSubmission = false

    constructor(
        private auth: AuthService,
        private emailTaken: EmailTaken
    ) {
    }

    name = new FormControl('', [
        Validators.required, Validators.minLength(3)
    ])
    email = new FormControl('',
        [
            Validators.required,
            Validators.email
        ], [this.emailTaken.validate])
    age = new FormControl<number | null>(null,
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
    }, [RegisterValidators.match('password', 'confirm_password')])

    async register() {
        this.showAlert = true
        this.alertMsg = 'Please wait! Your account is been created'
        this.alertColor = 'blue'
        this.inSubmission = true

        try {
            await this.auth.createUser(this.registerForm.value as IUser)
        } catch (e) {
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
