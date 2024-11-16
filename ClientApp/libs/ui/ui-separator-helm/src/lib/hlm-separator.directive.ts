import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

export type HlmSeparatorOrientation = 'horizontal' | 'vertical';
@Directive({
	selector: '[hlmSeparator],brn-separator[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSeparatorDirective {
	public readonly orientation = input<HlmSeparatorOrientation>('horizontal');
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'inline-flex shrink-0 border-0 bg-border',
			this.orientation() === 'horizontal' ? ' w-full border' : 'h-full w-[1px] border',
			this.userClass(),
		),
	);
}
