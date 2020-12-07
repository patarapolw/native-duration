import Duration, { DurationUnit, addDate } from ".";

const maxAcceptable: Partial<Record<DurationUnit, number>> = {
  ms: 1000,
  s: 60,
  min: 60,
  h: 24,
  d: 7,
  w: 4,
  mo: 12,
};

const now = new Date();
const REPEAT = 1000;

/**
 * Allow +/- 1 day AND within 5% error
 */
const isDurationExact = false;

Array(8)
  .fill(null)
  .map((_, i) => {
    /**
     * From minutes to about 30 years' duration
     */
    describe(`${Duration.of(10 ** (i + 5)).toString({
      granularity: 2,
    })} +/- 50%`, () => {
      const inp = Array(REPEAT)
        .fill(null)
        .map(() => {
          const msec = (Math.random() + 0.5) * 10 ** (i + 5);
          const since = new Date(+now - msec);
          const duration = new Duration(since, now);

          return {
            msec,
            since,
            duration,
          };
        });

      it("no value should exceed certain limits", () => {
        let missed = 0;

        inp.map(({ duration }) => {
          duration.toOrderedDict().map(([k, v]) => {
            const max = maxAcceptable[k];
            if (max && v > max) {
              console.error({ k, v, duration: duration.toString() });
              missed++;
            }
          });
        });

        if (missed) {
          throw new Error(
            `Some value exceeded the limit: ${missed.toLocaleString()} / ${REPEAT.toLocaleString()}`
          );
        }
      });

      it(
        isDurationExact
          ? "duration is precise"
          : "duration must be within +/- 1 day AND within 5% error",
        () => {
          let missed = 0;

          inp.map(({ since, duration, msec }) => {
            const calculated = duration
              .toOrderedDict()
              .reduce((prev, [k, v]) => addDate(prev)[k](-v), new Date(now));

            const ratio = (+now - +calculated) / msec;

            if (
              isDurationExact
                ? since.toISOString() !== calculated.toISOString()
                : !(
                    ratio > 0.95 &&
                    ratio < 1.05 &&
                    since >= new Date(+calculated - 1000 * 60 * 60 * 24) &&
                    since <= new Date(+calculated + 1000 * 60 * 60 * 24)
                  )
            ) {
              console.error({
                since,
                calculated,
                difference: new Duration(since, calculated).toString(),
                now,
                duration: duration.toString(),
                error: `${(ratio * 100 - 100).toPrecision(3)}%`,
              });
              missed++;
            }
          });

          if (missed) {
            throw new Error(
              `Duration might be miscalculated: ${missed.toLocaleString()} / ${REPEAT.toLocaleString()}`
            );
          }
        }
      );
    });
  });
