import { Sparklines, SparklinesLine } from 'react-sparklines';

import { differenceInMinutes } from 'date-fns/differenceInMinutes';

import { INTERVAL_DURATION_IN_MINUTES } from '@/utils/chart';

const MemberVersionsSparkLine = ({
  versionsGroupedByIntervals,
}: {
  versionsGroupedByIntervals: { [key: string]: number };
}): JSX.Element => {
  // get intervals and sort them from oldest to recent
  const intervals = Object.keys(versionsGroupedByIntervals).sort((a, b) =>
    a.localeCompare(b),
  );

  // intervals are not equally distributed, So we need to fill gaps for intervals with zero actions
  const versionsCountOverIntervals = intervals.reduce(
    (acc: number[], curr, index) => {
      const next = intervals[index + 1];
      // get time difference between two intervals
      const diff = differenceInMinutes(next, curr);

      const currTotalVersion = versionsGroupedByIntervals[curr];
      // total missing gaps
      const toFill = diff / INTERVAL_DURATION_IN_MINUTES;
      if (toFill > 1) {
        const missingGaps = new Array(toFill - 1).fill(0);
        return [...acc, currTotalVersion, ...missingGaps];
      }

      return [...acc, currTotalVersion];
    },
    [],
  );
  return (
    <Sparklines data={versionsCountOverIntervals} limit={5} height={20}>
      <SparklinesLine color="#5050d2" style={{ fill: 'none', opacity: 1 }} />
    </Sparklines>
  );
};
export default MemberVersionsSparkLine;
