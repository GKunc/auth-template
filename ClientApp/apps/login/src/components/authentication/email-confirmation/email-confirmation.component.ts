import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Card } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { httpResource, HttpResourceRef } from '@angular/common/http';

@Component({
  imports: [
    RouterModule,
    FormsModule,
    ButtonModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    Card,
    ReactiveFormsModule,
    SkeletonModule,
  ],
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
})
export class EmailConfirmationComponent {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  emailConfirmationResource: HttpResourceRef<void> = httpResource(() => ({
    url: '/api/accounts/confirm-email',
    params: {
      token: this.route.snapshot.queryParams['token'],
      email: this.route.snapshot.queryParams['email'],
    },
  }));

  goToLoginPage(): void {
    this.router.navigate(['login']);
  }
}
