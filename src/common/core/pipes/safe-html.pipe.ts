import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Just for testing
 *
 * @deprecated
 */
@Pipe({ name: 'safeHTML' })
export class SafeHTMLPipe {
    constructor(private sanitizer: DomSanitizer) {
        this.sanitizer = sanitizer;
    }

    public transform(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
