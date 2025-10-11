import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="flex flex-col gap-4">
      <span>{{
        config.data?.message ||
          'Are You sure You want to perform this operation?'
      }}</span>
      <div class="flex gap-2 justify-end">
        <p-button type="button" label="Cancel" (click)="cancel()" />
        <p-button
          type="button"
          label="Confirm"
          (click)="confirm()"
          severity="danger"
        />
      </div>
    </div>
  `,
  imports: [Button],
})
export class ConfirmDialogComponent {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  confirm() {
    this.ref.close(true);
  }

  cancel() {
    this.ref.close(false);
  }
}
