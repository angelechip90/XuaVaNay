import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFormat',
    standalone: true
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string | Date, format: string = 'dd/MM/yyyy'): string {
        if (!value) return '';

        const date = new Date(value);

        if (isNaN(date.getTime())) return '';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        switch (format) {
            case 'dd/MM/yyyy':
                return `${day}/${month}/${year}`;
            case 'dd/MM/yyyy HH:mm':
                return `${day}/${month}/${year} ${hours}:${minutes}`;
            case 'MM/yyyy':
                return `${month}/${year}`;
            case 'yyyy':
                return year.toString();
            default:
                return date.toLocaleDateString('vi-VN');
        }
    }
}
