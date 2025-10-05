import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [CommonModule],
    standalone: true
})
export class HeaderComponent {
    @Input() title: string = 'XuaVaNay';
    @Input() showBackButton: boolean = false;
    @Input() showMenuButton: boolean = false;
}
