import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ButtonComponent } from './components/button/button.component';

const hasDarkModeEnabled = localStorage.getItem('darkmode') === 'enabled';
const bodyElement = document.body;

const darkModeIdentifier = 'darkmode';

if (hasDarkModeEnabled) {
    bodyElement.classList.toggle(darkModeIdentifier);
}

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatIconModule, MatTooltipModule, RouterLink, ButtonComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    darkMode = signal(hasDarkModeEnabled);

    darkModeDerived = computed(() => ({
        tooltip: this.darkMode() ? 'Switch to light mode' : 'Switch to dark mode',
        icon: this.darkMode() ? 'light_mode' : 'dark_mode',
    }));

    toggleDarkMode() {
        bodyElement.classList.toggle(darkModeIdentifier);
        const nextState = !this.darkMode();
        localStorage.setItem('darkmode', nextState ? 'enabled' : 'disabled');
        this.darkMode.set(nextState);
    }
}
