import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-section-logo',
  templateUrl: './section-logo.component.html',
  styleUrls: ['./section-logo.component.scss'],
  standalone: true,
  imports: [],
})
export class SectionLogoComponent implements OnInit {
  svgId: string = `logo-gradient-${Math.random().toString(36).substr(2, 9)}`;

  constructor() {}

  ngOnInit() {}
}
