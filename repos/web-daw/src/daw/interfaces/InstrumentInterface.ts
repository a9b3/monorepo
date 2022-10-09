import type { UnitInterface, SchedulerHandlerArg, Note } from 'daw'

/**
 * An instrument is a sound source. It should implement UnitInterface so it can
 * be plugged into an output source like Channel.
 * It should also implement the handler function so it can be instructed on how
 * to play an arrangement.
 *
 * An instrument's sound source should understand frequency which is what the
 * Note will contain.
 *
 * For convenience use the NOTES constant to convert named notes to frequency.
 */
export interface InstrumentInterface extends UnitInterface {
  handler(arg0: SchedulerHandlerArg & { note: Note }): void
}
