import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { SuggestDTO } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-suggest',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './ticket-suggest.component.html',
  styleUrls: ['./ticket-suggest.component.scss']
})
export class TicketSuggestComponent {
  @Input() suggestion!: SuggestDTO;
  @Output() useSteps = new EventEmitter<string[]>();

  isOpen = false;

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  applySuggestion() {
    this.useSteps.emit(this.suggestion.solutionSteps);

    this.isOpen = false;
  }
}