import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="goBack()" class="mb-4 text-blue-600 hover:text-blue-800 underline">
      ← Back
    </button>
  `,
})
export class BackButtonComponent {
  constructor(private location: Location) {}
  goBack(): void { this.location.back(); }
}


