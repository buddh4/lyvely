import { UpdateHabitModel } from './update-habit.model';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAssignmentStrategy } from '@lyvely/common';
describe('UpdateHabitModel', () => {
    describe('transform', function () {
        it('filter by habit type success', async () => {
            plainToClass(UpdateHabitModel, {
                optimal: 3,
                max: 3,
                min: 3,
                score: 3,
                interval: 0,
                strategy: 'checkbox_number',
                userStrategy: UserAssignmentStrategy.Shared,
                categories: ['asdf'],
                title: 'hess',
                plan: 3,
                text: 'asdfasdf',
            });
        });
    });
    describe('validate', function () {
        it('test', async () => {
            const model = plainToClass(UpdateHabitModel, { title: 'test' });
            const validation = await validate(model);
            expect(validation.length).toEqual(0);
        });
    });
});
