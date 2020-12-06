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

Array(7)
  .fill(null)
  .map((_, i) => {
    /**
     * From minutes to about 3 years' duration
     */
    describe(Duration.fromMillsecond(10 ** (i + 5)).toString(), () => {
      /**
       * 10k repeats
       */
      const inp = Array(10 ** 4)
        .fill(null)
        .map(() => {
          const msec = (Math.random() + 0.5) * 10 ** (i + 5);
          const since = new Date(+now - msec);
          const map = new Duration(since, now);

          return {
            msec,
            since,
            map,
          };
        });

      it("no value should exceed certain limits", () => {
        inp.map(({ map }) => {
          map.order.map(([k, v]) => {
            const max = maxAcceptable[k];
            if (max && v > max) {
              console.error({ k, v, map });
              throw new Error("Some value exceeded the limit");
            }
          });
        });
      });

      it("duration must be within +/- 1 day and within 5% error", () => {
        inp.map(({ since, map, msec }) => {
          const calculated = map.order.reduce(
            (prev, [k, v]) => addDate(prev)[k](-v),
            new Date(now)
          );

          const ratio = (+now - +calculated) / msec;

          if (
            !(ratio > 0.95 && ratio < 1.05) ||
            !(
              since >= new Date(+calculated - 1000 * 60 * 60 * 24) &&
              since <= new Date(+calculated + 1000 * 60 * 60 * 24)
            )
          ) {
            console.error({ since, calculated, now, map, ratio });
            throw new Error("Duration might be miscalculated");
          }
        });
      });
    });
  });
