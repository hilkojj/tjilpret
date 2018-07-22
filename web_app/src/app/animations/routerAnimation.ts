import {
    trigger,
    animate,
    transition,
    style,
    query
} from '@angular/animations';

export const routerAnimation = trigger('routerAnimation', [
    transition('* => *', [
        query(
            ':enter',
            [
                style({ opacity: 0, transform: "scale(1.1)" }),
                animate('0.3s ease-out', style({ opacity: 1, transform: "scale(1)" }))
            ],
            { optional: true }
        )
    ])
]);