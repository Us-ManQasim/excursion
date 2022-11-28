import { User } from 'src/users/users.modal';
import { EXCURSION_REPOSITORY, USER_REPOSITORY } from '../core/constants';
import { Excursion } from './excursion.modal';

export const excursionProviders = [
    {
        provide: EXCURSION_REPOSITORY,
        useValue: Excursion,
    },
    {
        provide: USER_REPOSITORY,
        useValue: User
    }
];
