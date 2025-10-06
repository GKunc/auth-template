import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@client-app/shared';

import { ButtonModule } from 'primeng/button';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Card } from 'primeng/card';
import { catchError, finalize, throwError } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ButtonModule,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    Card,
    ReactiveFormsModule,
    SkeletonModule
],
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
})
export class EmailConfirmationComponent implements OnInit {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private destroyedRef: DestroyRef = inject(DestroyRef);

  success = false;
  loading = true;

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    const email = this.route.snapshot.queryParams['email'];
    this.authService
      .confirmEmail(token, email)
      .pipe(
        takeUntilDestroyed(this.destroyedRef),
        catchError((e) => {
          this.success = false;
          return throwError(() => e);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe(() => {
        this.success = true;
      });
  }

  goToLoginPage(): void {
    this.router.navigate(['login']);
  }
}
