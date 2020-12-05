import { Unit, addDate, durationToRecord, msecToString } from ".";

const maxAcceptable: Partial<Record<Unit, number>> = {
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
    describe(msecToString(10 ** (i + 5)), () => {
      /**
       * 10k repeats
       */
      const inp = Array(10 ** 4)
        .fill(null)
        .map(() => {
          const msec = (Math.random() + 0.5) * 10 ** (i + 5);
          const since = new Date(+now - msec);
          const map = durationToRecord(since, now);

          return {
            msec,
            since,
            map,
          };
        });

      it("no value should exceed certain limits", () => {
        inp.map(({ map }) => {
          Object.entries(map.d).map(([k, v]) => {
            const max = maxAcceptable[k as Unit];
            if (max && v > max) {
              console.error({ k, v, map });
              throw new Error("Some value exceeded the limit");
            }
          });
        });
      });

      it("duration must be within +/- 1 day and within 5% error", () => {
        inp.map(({ since, map, msec }) => {
          const calculated = Object.entries(map.d).reduce(
            (prev, [k, v]) => addDate[k as Unit](prev, -v),
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
