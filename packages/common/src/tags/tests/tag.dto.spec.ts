import { expect } from '@jest/globals';
import { validate } from 'class-validator';
import { CreateTagDto } from "../create-tag.dto";
import { UpdateHabitDto } from "../../activity";

describe('UpdateHabitDto', () => {

  describe('validate', function () {
    it('test', async () => {
      const model = new CreateTagDto({  });
      const validation = await validate(model);
      expect(!!validation.length).toEqual(true);
    });

    it('test2', async () => {
      const model = new UpdateHabitDto({  });
      const validation = await validate(model);
      expect(validation.length).toEqual(0);
    });
  });
});
