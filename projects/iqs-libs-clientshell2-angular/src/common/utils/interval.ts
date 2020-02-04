import { Observable, interval } from 'rxjs';
import { filter, scan } from 'rxjs/operators';

export function pausableInterval(isPaused): Observable<number> {
    return interval(10000).pipe(
        filter(tick => !isPaused()),
        scan((acc, tick) => acc + 1)
    );
}
