import { Injectable, Inject, Logger } from '@nestjs/common';
import { Habit } from '../schemas';
import { ContentTypeService, UpdateQuerySet, ProtectedProfileContext } from '@lyvely/api';
import { HabitsDao } from '../daos';
import { CreateHabitModel, UpdateHabitModel } from '@lyvely/habits-interface';

/**
 * Represents a service for managing Habit content.
 */
@Injectable()
export class HabitsService extends ContentTypeService<Habit, CreateHabitModel> {
  /** A Data Access Object (DAO) for Habits. **/
  @Inject()
  protected contentDao: HabitsDao;

  /** Class specific logger. **/
  protected logger = new Logger(HabitsService.name);

  /**
   * Persists a new Habit document.
   * This is part of the ContentTypeService template and is responsible for mapping create models to actual
   * model instances.
   *
   * @param context
   * @param {CreateHabitModel} model - The data for creating the habit.
   * @returns {Promise<Habit>} - The newly created habit instance with the assigned sort order.
   * @protected
   */
  protected override async createInstance(
    context: ProtectedProfileContext,
    model: CreateHabitModel,
  ): Promise<Habit> {
    return Habit.create(context, model);
  }

  /**
   * Creates and applies an update to a Habit.
   * This is part of the ContentTypeService template and is responsible for mapping update models to actual
   * document updates.
   *
   * @param context
   * @param {Habit} content - The habit object to be updated.
   * @param {UpdateHabitModel} model - The update model containing the changes to be made.
   * @protected
   * @returns {Habit} - The updated habit object.
   */
  protected override async createUpdate(
    context: ProtectedProfileContext,
    content: Habit,
    model: UpdateHabitModel,
  ): Promise<UpdateQuerySet<Habit>> {
    return content.applyUpdate(model);
  }
}
