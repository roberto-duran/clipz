import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    credentials = {
        email: '',
        password: ''
    }
    showAlert = false
    alertMsg = 'Please wait! Your account is been created'
    alertColor = 'blue'

    constructor() {
    }

    ngOnInit(): void {
    }
    login(){
        this.showAlert = true
        this.alertMsg = 'Please wait! Logging in'
        this.alertColor = 'blue'
    }

}
