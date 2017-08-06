import moment from 'moment';

import invariant from 'invariant';

const END = new Date(2000, 0, 1);

function getMoment(locale, createFn = moment => moment) {
  invariant(locale, 'Must provide a valid locale to getMoment');
  const fn = createFn(moment);
  invariant(fn, 'Must provide a valid create function to getMoment');
  return (...args) => fn(...args).locale(locale);
}

export const extrapolate = function(locale) {
  const dateFn = getMoment(locale, /* createFn = */ moment => moment.utc);

  const end = dateFn(END).startOf('day');

  const today = dateFn().startOf('day');
  const startOfThisWeek = dateFn(today).startOf('week').startOf('day');
  const startOfThisMonth = dateFn(today).startOf('month').startOf('day');
  const startOfThisYear = dateFn(today).startOf('year').startOf('day');

  const periods = [
    {
      id: `day-${today.day()}`,
      title: getDayOfWeekTitle(0),
      to: null,
      from: +today,
    },
  ];

  if (today.isSame(startOfThisWeek)) {
    function isInFirstWeekOfThisMonth(d) {
      return (
        d.isSameOrAfter(startOfThisMonth) &&
        d.isSameOrBefore(endOfFirstWeekOfThisMonth)
      );
    }

    const endOfFirstWeekOfThisMonth = dateFn(startOfThisMonth).add(1, 'week');

    let d = dateFn(today).add(-1, 'day').startOf('day');
    let yesterday = true;
    while (d.isAfter(end) && isInFirstWeekOfThisMonth(d)) {
      periods.push({
        id: `day-${d.day()}`,
        title: yesterday ? 'hier' : d.format('dddd'),
        to: +dateFn(d).endOf('day'),
        from: +d,
      });
      d = dateFn(d).add(-1, 'day').startOf('day');
      yesterday = false;
    }
  } else {
    // Add all days of this week
    [-1, -2, -3, -4, -5, -6].forEach(function(index) {
      const startOfDay = dateFn(today).add(index, 'days').startOf('day');

      if (
        startOfDay.isAfter(end) &&
        !isLastWeek(startOfDay) &&
        !isLastMonth(startOfDay)
      ) {
        periods.push({
          id: `day-${startOfDay.day()}`,
          title: getDayOfWeekTitle(index),
          to: +dateFn(startOfDay).endOf('day'),
          from: +startOfDay,
        });
      }
    });
  }

  // Add all weeks of this month
  [-1, -2, -3].forEach(function(index) {
    const startOfWeek = moment
      .utc(today)
      .add(index, 'weeks')
      .startOf('week')
      .startOf('day');

    if (startOfWeek.isAfter(end) && !isLastMonth(startOfWeek)) {
      periods.push({
        id: `week-${startOfWeek.week()}`,
        title: getWeekOfMonthTitle(index),
        to: +dateFn(startOfWeek).endOf('week').endOf('day'),
        from: +startOfWeek,
      });
    }
  });

  // Add all months of this year
  [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11].forEach(function(index) {
    const startOfMonth = moment
      .utc(today)
      .add(index, 'months')
      .startOf('month')
      .startOf('day');

    if (startOfMonth.isAfter(end) && !isLastYear(startOfMonth)) {
      periods.push({
        id: `month-${startOfMonth.month()}`,
        title: getMonthOfYearTitle(index),
        to: +dateFn(startOfMonth).endOf('month').endOf('day'),
        from: +startOfMonth,
      });
    }
  });

  // Add all years upto end
  let curYear = startOfThisYear.add(-1, 'year').startOf('year').startOf('day');
  while (curYear.isAfter(end)) {
    periods.push({
      id: `year-${curYear.year()}`,
      title: String(curYear.year()),
      to: +dateFn(curYear).endOf('year').endOf('day'),
      from: +curYear,
    });

    curYear = curYear.add(-1, 'year').startOf('year').startOf('day');
  }

  return periods;

  function isLastWeek(date) {
    return dateFn(date).isBefore(startOfThisWeek);
  }

  function isLastMonth(date) {
    return dateFn(date).isBefore(startOfThisMonth);
  }

  function isLastYear(date) {
    return dateFn(date).isBefore(startOfThisYear);
  }

  function getDayOfWeekTitle(index) {
    switch (index) {
      case 0:
        return `aujourd\'hui`;
      case -1:
        return 'hier';
    }
    return dateFn().day(today.day() + index).format('dddd');
  }

  function getWeekOfMonthTitle(index) {
    switch (index) {
      case -1:
        return 'la semaine derniere';
    }
    return `il y a ${Math.abs(index)} semaines`;
  }

  function getMonthOfYearTitle(index) {
    return dateFn().month(today.month() + index).format('MMMM YYYY');
  }
};

export const durations = [
  {
    duration: 1,
    label: 'Une journée',
  },
  {
    duration: 3,
    label: '3 jours',
  },
  {
    duration: 7,
    label: '1 semaine',
  },
  {
    duration: 14,
    label: '2 semaines',
  },
  {
    duration: 30.417,
    label: '1 mois',
  },
  {
    duration: 60.833,
    label: '2 mois',
  },
  {
    duration: 91.25,
    label: '3 mois',
  },
  {
    duration: 182.5,
    label: '6 mois',
  },
  {
    duration: 273.75,
    label: '9 mois',
  },
  {
    duration: 365.2422,
    label: '1 an',
  },
  {
    duration: 547.501,
    label: '18 mois',
  },
  {
    duration: 730,
    label: '2 ans',
  },
  {
    duration: 1095,
    label: '3 ans',
  },
  {
    duration: -1,
    label: 'Plus de 3 ans',
  },
];
