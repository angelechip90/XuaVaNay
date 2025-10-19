import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago'
})
export class TimeagoPipe implements PipeTransform {

  transform(value: Date | string | number): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // giây

    const rtf = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    console.log('value:', value);
    console.log('date:', date.toString());
    console.log('now:', now.toString());
    console.log('diff:', diff);

    if (diff < 60) return 'Vừa xong';
    else if (minutes < 60) return rtf.format(-minutes, 'minute');
    else if (hours < 24) return rtf.format(-hours, 'hour');
    else if (days < 7) return rtf.format(-days, 'day');
    else if (days < 30) return rtf.format(-Math.floor(days / 7), 'week');
    else if (days < 365) return rtf.format(-Math.floor(days / 30), 'month');
    else return rtf.format(-Math.floor(days / 365), 'year');
  }
}
