import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Just for testing
 *
 * @deprecated
 */
@Pipe({ name: 'safeStyle' })
export class SafeStylePipe {
    constructor(private sanitizer: DomSanitizer) {
        this.sanitizer = sanitizer;
    }

    public transform(style) {
        return this.sanitizer.bypassSecurityTrustStyle(style);
    }
}
