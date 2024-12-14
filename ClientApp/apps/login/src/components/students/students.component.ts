import {
  Component,
  OnInit,
  TrackByFunction,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';
import {
  lucideArrowUpDown,
  lucideChevronDown,
  lucideEllipsis,
} from '@ng-icons/lucide';
import { FormsModule } from '@angular/forms';
import {
  BrnTableModule,
  PaginatorState,
  useBrnColumnManager,
} from '@spartan-ng/ui-table-brain';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { BrnSelectModule } from '@spartan-ng/ui-select-brain';

import {
  HlmCheckboxComponent,
  HlmCheckboxCheckIconComponent,
} from '@spartan-ng/ui-checkbox-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, map } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Student } from './students.model';

@Component({
  standalone: true,
  imports: [
    FormsModule,

    BrnMenuTriggerDirective,
    HlmMenuModule,

    BrnTableModule,
    HlmTableModule,

    HlmButtonModule,

    DecimalPipe,
    TitleCasePipe,
    HlmIconComponent,
    HlmInputDirective,

    HlmCheckboxCheckIconComponent,
    HlmCheckboxComponent,

    BrnSelectModule,
    HlmSelectModule,
  ],
  selector: 'app-students',
  templateUrl: './students.component.html',
  providers: [
    provideIcons({ lucideChevronDown, lucideEllipsis, lucideArrowUpDown }),
  ],
})
export class StudentsComponennt implements OnInit {
  http: HttpClient = inject(HttpClient);

  private readonly _payments = signal([]);

  ngOnInit(): void {
    this.http
      .get('/api/students')
      .subscribe((students: any) => this._payments.set(students));
  }

  protected readonly _rawFilterInput = signal('');
  protected readonly _emailFilter = signal('');
  private readonly _debouncedFilter = toSignal(
    toObservable(this._rawFilterInput).pipe(debounceTime(300))
  );

  private readonly _displayedIndices = signal({ start: 0, end: 0 });
  protected readonly _pageSize = signal(100_000);

  private readonly _selectionModel = new SelectionModel<Student>(true);
  protected readonly _isPaymentSelected = (student: Student) =>
    this._selectionModel.isSelected(student);
  protected readonly _selected = toSignal(
    this._selectionModel.changed.pipe(map((change) => change.source.selected)),
    {
      initialValue: [],
    }
  );

  protected readonly _brnColumnManager = useBrnColumnManager({
    firstName: { visible: true, label: 'First Name' },
    lastName: { visible: true, label: 'Last Name' },
    email: { visible: true, label: 'Email' },
    phone: { visible: true, label: 'Phone' },
  });
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
    'actions',
  ]);

  private readonly _filteredPayments = computed(() => {
    const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (emailFilter && emailFilter.length > 0) {
      return this._payments().filter((u: Student) =>
        u.email.toLowerCase().includes(emailFilter)
      );
    }
    return this._payments();
  });
  private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedPayments = computed(() => {
    const sort = this._emailSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const payments = this._filteredPayments();
    if (!sort) {
      return payments.slice(start, end);
    }
    return [...payments]
      .sort(
        (p1: Student, p2: Student) =>
          (sort === 'ASC' ? 1 : -1) * p1.email.localeCompare(p2.email)
      )
      .slice(start, end);
  });
  protected readonly _allFilteredPaginatedPaymentsSelected = computed(() =>
    this._filteredSortedPaginatedPayments().every((payment) =>
      this._selected().includes(payment)
    )
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate =
      this._allFilteredPaginatedPaymentsSelected() ? true : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<Student> = (
    _: number,
    p: Student
  ) => p.id;
  protected readonly _totalElements = computed(
    () => this._filteredPayments().length
  );
  protected readonly _onStateChange = ({
    startIndex,
    endIndex,
  }: PaginatorState) =>
    this._displayedIndices.set({ start: startIndex, end: endIndex });

  constructor() {
    // needed to sync the debounced filter to the name filter, but being able to override the
    // filter when loading new users without debounce
    effect(() => this._emailFilter.set(this._debouncedFilter() ?? ''), {
      allowSignalWrites: true,
    });
  }

  protected togglePayment(student: Student) {
    this._selectionModel.toggle(student);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedPayments());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedPayments());
    }
  }

  protected handleEmailSortChange() {
    const sort = this._emailSort();
    if (sort === 'ASC') {
      this._emailSort.set('DESC');
    } else if (sort === 'DESC') {
      this._emailSort.set(null);
    } else {
      this._emailSort.set('ASC');
    }
  }
}
