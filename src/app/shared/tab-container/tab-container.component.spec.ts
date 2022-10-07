import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from "@angular/core";
import {By} from "@angular/platform-browser";

import {TabContainerComponent} from './tab-container.component';
import {TabComponent} from "../tab/tab.component";

@Component({
    template: `
        <app-tab-container>
            <app-tab tabTitle="Tab 1">Tab 1</app-tab>
            <app-tab tabTitle="Tab 2">Tab 2</app-tab>
        </app-tab-container>`
})
class TestHostComponent {

}

describe('TabContainerComponent', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestHostComponent, TabComponent, TabContainerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have two tabs', () => {
        const tabs = fixture.debugElement.queryAll( By.css('li'));
        const containerComponent = fixture.debugElement.query(
            By.directive(TabContainerComponent)
        );
        const tabsProp = containerComponent.componentInstance.tabs;

        expect(tabs.length).withContext("Tabs did not render").toBe(2);
        expect(tabsProp.length).withContext("Could not grab component property").toBe(2);
    });
});
